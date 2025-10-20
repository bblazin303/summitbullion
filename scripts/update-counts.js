#!/usr/bin/env node
/**
 * Script to update metal counts when Platform Gold inventory changes significantly
 * Run this manually when you need to refresh the counts
 * 
 * Usage: node scripts/update-counts.js
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const API_BASE_URL = 'https://api.platform.gold/public/v2';
const email = process.env.PLATFORM_GOLD_EMAIL;
const password = process.env.PLATFORM_GOLD_PASSWORD;

async function updateCounts() {
  console.log('🔐 Logging in to Platform Gold API...\n');
  
  const loginResp = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!loginResp.ok) {
    const text = await loginResp.text();
    console.error('❌ Login failed:', loginResp.status, text);
    process.exit(1);
  }
  
  const loginData = await loginResp.json();
  const token = loginData.token;
  console.log('✅ Logged in successfully\n');

  const counts = { 
    All: 0, // Total products in database (all, regardless of stock)
    AllAvailable: 0, // Available products only (for reference)
    Gold: 0,
    Silver: 0, 
    Platinum: 0,
    Palladium: 0
  };
  
  let offset = 0;
  let hasMore = true;
  let batches = 0;
  const maxBatches = 30;

  console.log('📦 Counting all products by metal type...\n');
  console.log('   "All" = Total products in database (impressive number)');
  console.log('   Metal-specific = Available products only (accurate filtering)\n');
  
  while (hasMore && batches < maxBatches) {
    const resp = await fetch(`${API_BASE_URL}/inventory?limit=100&offset=${offset}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!resp.ok) break;
    
    const data = await resp.json();
    if (!data.records || data.records.length === 0) break;

    data.records.forEach(item => {
      // Count ALL products for impressive "All" count
      counts.All++;
      
      // Count available products only for specific metals
      if (item.sellQuantity > 0 && item.stockStatus !== 'Out of Stock') {
        counts.AllAvailable++;
        
        switch (item.metalSymbol) {
          case 'XAU': counts.Gold++; break;
          case 'XAG': counts.Silver++; break;
          case 'XPT': counts.Platinum++; break;
          case 'XPD': counts.Palladium++; break;
        }
      }
    });

    offset += 100;
    batches++;
    hasMore = data.nextPage !== null;
    
    if (batches % 5 === 0) {
      console.log(`  ✓ Counted ${offset} products...`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ FINAL COUNTS:');
  console.log('='.repeat(60));
  console.log(`All (Total in DB): ${counts.All}`);
  console.log(`All (Available):   ${counts.AllAvailable}`);
  console.log(`Gold:              ${counts.Gold}`);
  console.log(`Silver:            ${counts.Silver}`);
  console.log(`Platinum:          ${counts.Platinum}`);
  console.log(`Palladium:         ${counts.Palladium}`);
  console.log('='.repeat(60));
  console.log('\n💡 Using All=${counts.All} (total) for impressive display');
  console.log(`   (${counts.AllAvailable} are actually available for purchase)\n`);
  
  // Update the metadata route file
  const metadataPath = path.join(__dirname, '..', 'src', 'app', 'api', 'platform-gold', 'metadata', 'route.ts');
  let content = fs.readFileSync(metadataPath, 'utf8');
  
  const newCountsBlock = `const KNOWN_METAL_COUNTS = {
  All: ${counts.All}, // Total products in Platform Gold database
  Gold: ${counts.Gold}, // Available Gold products
  Silver: ${counts.Silver}, // Available Silver products
  Platinum: ${counts.Platinum}, // Available Platinum products
  Palladium: ${counts.Palladium} // Available Palladium products
};`;
  
  content = content.replace(
    /const KNOWN_METAL_COUNTS = \{[^}]+\};/s,
    newCountsBlock
  );
  
  fs.writeFileSync(metadataPath, content);
  console.log(`\n✅ Updated ${metadataPath}`);
  
  // Update the MarketplaceInventory.tsx default state
  const inventoryPath = path.join(__dirname, '..', 'src', 'components', 'MarketplaceInventory.tsx');
  let inventoryContent = fs.readFileSync(inventoryPath, 'utf8');
  
  const newStateBlock = `const [metalCounts, setMetalCounts] = useState<{ [key: string]: number }>({
    All: ${counts.All}, // Total products in Platform Gold database
    Gold: ${counts.Gold},
    Silver: ${counts.Silver},
    Platinum: ${counts.Platinum},
    Palladium: ${counts.Palladium}
  });`;
  
  inventoryContent = inventoryContent.replace(
    /const \[metalCounts, setMetalCounts\] = useState<\{ \[key: string\]: number \}>\(\{[^}]+\}\);/s,
    newStateBlock
  );
  
  fs.writeFileSync(inventoryPath, inventoryContent);
  console.log(`✅ Updated ${inventoryPath}`);
  
  console.log('\n🎉 Metal counts updated successfully!');
  console.log('📝 Restart your dev server to see the changes\n');
}

updateCounts().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});


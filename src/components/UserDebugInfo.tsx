"use client";

import { useUser } from "@account-kit/react";
import { useFirebaseSync } from "@/hooks/useFirebaseSync";

/**
 * Debug component to show all user data from Alchemy
 * Use this to verify what data we get after login
 */
export default function UserDebugInfo() {
  const user = useUser();
  const { isSynced } = useFirebaseSync();

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md shadow-lg z-50">
        <h3 className="font-bold text-red-900 mb-2">🔴 Not Logged In</h3>
        <p className="text-sm text-red-700">User object is null</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 max-w-md shadow-lg z-50 max-h-[80vh] overflow-auto">
      <h3 className="font-bold text-green-900 mb-2">✅ Logged In - User Data:</h3>
      <div className="mb-2 text-xs">
        <span className="font-semibold">Firebase:</span>{" "}
        {isSynced ? (
          <span className="text-green-700">✅ Synced</span>
        ) : (
          <span className="text-yellow-700">⏳ Syncing...</span>
        )}
      </div>
      <div className="text-xs font-mono space-y-1">
        <div>
          <span className="text-gray-600">Email:</span>{" "}
          <span className="text-green-800 font-semibold">{user.email || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-600">Wallet:</span>{" "}
          <span className="text-green-800 font-semibold">{user.address}</span>
        </div>
        <div>
          <span className="text-gray-600">User ID:</span>{" "}
          <span className="text-green-800">{user.userId}</span>
        </div>
        <div>
          <span className="text-gray-600">Org ID:</span>{" "}
          <span className="text-green-800">{user.orgId}</span>
        </div>
        <div>
          <span className="text-gray-600">Type:</span>{" "}
          <span className="text-green-800">{user.type}</span>
        </div>
        {user.phone && (
          <div>
            <span className="text-gray-600">Phone:</span>{" "}
            <span className="text-green-800">{user.phone}</span>
          </div>
        )}
        {user.solanaAddress && (
          <div>
            <span className="text-gray-600">Solana:</span>{" "}
            <span className="text-green-800">{user.solanaAddress}</span>
          </div>
        )}
      </div>
      
      <details className="mt-3">
        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
          Raw JSON (click to expand)
        </summary>
        <pre className="text-[10px] bg-white p-2 rounded mt-2 overflow-auto max-h-48">
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
}


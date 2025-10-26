"use client";

// Alchemy Account Kit Provider Wrapper
// Based on: https://www.alchemy.com/docs/wallets/react/quickstart/existing-project

import { config, queryClient } from "@/config/alchemy";
import {
  AlchemyAccountProvider,
  AlchemyAccountsProviderProps,
} from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const AlchemyProviders = (
  props: PropsWithChildren<{
    initialState?: AlchemyAccountsProviderProps["initialState"];
  }>
) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={config}
        queryClient={queryClient}
        initialState={props.initialState}
      >
        {props.children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
};


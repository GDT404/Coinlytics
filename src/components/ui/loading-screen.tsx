'use client'
import { LumaSpin } from "@/components/ui/luma-spin"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#101214] animate-in fade-in duration-500">
      <div className="mb-8">
        <LumaSpin />
      </div>
      <h2 className="text-[#DEE4EA] text-xl font-bold tracking-tight animate-pulse">
        COINLYTICS
      </h2>
      <p className="text-[#596773] text-sm mt-2 font-light">
        Sincronizando seus dados...
      </p>
    </div>
  )
}
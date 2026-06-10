<template>
  <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Hourly Sales Trend</h3>
        <p class="text-xs text-slate-400 mt-0.5">Real-time daily register performance tracker</p>
      </div>
      <span class="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded">TODAY</span>
    </div>

    <div class="h-64 w-full bg-slate-50/50 dark:bg-slate-950/40 rounded-xl p-2 flex items-end relative overflow-hidden border border-slate-100 dark:border-slate-900/60">
      <svg class="w-full h-full pt-6 pb-2" viewBox="0 0 600 200" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(148,163,184,0.08)" stroke-dasharray="4"/>
        <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(148,163,184,0.08)" stroke-dasharray="4"/>
        <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(148,163,184,0.08)" stroke-dasharray="4"/>
        
        <path d="M 0 175 C 100 160, 150 130, 200 135 C 250 140, 280 75, 350 85 C 420 95, 480 35, 600 25" fill="none" stroke="#4f46e5" stroke-width="3" stroke-linecap="round"/>
        <path d="M 0 175 C 100 160, 150 130, 200 135 C 250 140, 280 75, 350 85 C 420 95, 480 35, 600 25 L 600 200 L 0 200 Z" fill="url(#chartGrad)" opacity="0.1"/>
        
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4f46e5" />
            <stop offset="100%" stop-color="#4f46e5" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      <div class="absolute bottom-1.5 inset-x-0 px-4 flex justify-between text-[10px] font-bold text-slate-400">
        <span>08:00 AM</span>
        <span>12:00 PM</span>
        <span>03:00 PM</span>
        <span>06:00 PM</span>
        <span>09:00 PM</span>
      </div>
    </div>
  </div>
</template>
"use client";

export function DarkModeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Force dark mode immediately
          (function() {
            const html = document.documentElement;
            const body = document.body;
            
            // Add dark class immediately
            html.classList.add('dark');
            html.style.colorScheme = 'dark';
            
            // Set background to prevent flash
            body.style.backgroundColor = '#0f0f0f';
            body.style.color = '#f4f4f5';
            
            // Prevent any light mode preference
            try {
              localStorage.setItem('theme', 'dark');
              if (localStorage.getItem('theme') !== 'dark') {
                localStorage.removeItem('theme');
              }
            } catch (e) {}
            
            // Override any system preferences
            if (window.matchMedia) {
              const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
              if (mediaQuery.matches) {
                html.classList.add('dark');
              }
            }
          })();
        `,
      }}
    />
  );
}
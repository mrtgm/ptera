export default {
	darkMode: ["class"],
	content: ["./client/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				bounce: "bounce 1s cubic-bezier(.36,.07,.19,.97) infinite",
				sway: "sway 1s cubic-bezier(.36,.07,.19,.97) infinite",
				wobble: "wobble 1s cubic-bezier(.36,.07,.19,.97) infinite",
				flash: "flash 1s cubic-bezier(.36,.07,.19,.97) infinite",
				shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite",
				"text-blink": "textBlink 0.8s infinite",
			},
			keyframes: {
				bounce: {
					"0%, 100%": {
						transform: "translateY(0)",
					},
					"50%": {
						transform: "translateY(5px)",
					},
				},
				sway: {
					"0%, 100%": {
						transform: "translateX(0)",
					},
					"25%": {
						transform: "translateX(-10px)",
					},
					"75%": {
						transform: "translateX(10px)",
					},
				},
				wobble: {
					"0%, 100%": {
						transform: "rotate(0deg)",
					},
					"25%": {
						transform: "rotate(-5deg)",
					},
					"75%": {
						transform: "rotate(5deg)",
					},
				},
				flash: {
					"0%, 100%": {
						opacity: "1",
					},
					"50%": {
						opacity: "0",
					},
				},
				shake: {
					"10%, 90%": {
						transform: "translate3d(-1px, 0, 0)",
					},
					"20%, 80%": {
						transform: "translate3d(2px, 0, 0)",
					},
					"30%, 50%, 70%": {
						transform: "translate3d(-4px, 0, 0)",
					},
					"40%, 60%": {
						transform: "translate3d(4px, 0, 0)",
					},
				},
				textBlink: {
					"0%": { opacity: "1" },
					"50%": { opacity: "0.3" },
					"100%": { opacity: "1" },
				},
			},
			fontFamily: {
				sans: [
					"Inter",
					"ui-sans-serif",
					"system-ui",
					"sans-serif",
					"Apple Color Emoji",
					"Segoe UI Emoji",
					"Segoe UI Symbol",
					"Noto Color Emoji",
				],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

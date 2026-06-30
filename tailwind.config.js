const legacyColors = {
	amber: {
		50: '#fffbeb',
		100: '#fef3c7',
		200: '#fde68a',
		300: '#fcd34d',
		400: '#fbbf24',
		500: '#f59e0b',
		600: '#d97706',
		700: '#b45309',
		800: '#92400e',
		900: '#78350f',
		950: '#451a03'
	},
	orange: {
		50: '#fff7ed',
		100: '#ffedd5',
		200: '#fed7aa',
		300: '#fdba74',
		400: '#fb923c',
		500: '#f97316',
		600: '#ea580c',
		700: '#c2410c',
		800: '#9a3412',
		900: '#7c2d12',
		950: '#431407'
	},
	pink: {
		50: '#fdf2f8',
		100: '#fce7f3',
		200: '#fbcfe8',
		300: '#f9a8d4',
		400: '#f472b6',
		500: '#ec4899',
		600: '#db2777',
		700: '#be185d',
		800: '#9d174d',
		900: '#831843',
		950: '#500724'
	},
	blue: {
		50: '#eff6ff',
		100: '#dbeafe',
		200: '#bfdbfe',
		300: '#93c5fd',
		400: '#60a5fa',
		500: '#3b82f6',
		600: '#2563eb',
		700: '#1d4ed8',
		800: '#1e40af',
		900: '#1e3a8a',
		950: '#172554'
	},
	sky: {
		50: '#f0f9ff',
		100: '#e0f2fe',
		200: '#bae6fd',
		300: '#7dd3fc',
		400: '#38bdf8',
		500: '#0ea5e9',
		600: '#0284c7',
		700: '#0369a1',
		800: '#075985',
		900: '#0c4a6e',
		950: '#082f49'
	},
	red: {
		50: '#fef2f2',
		100: '#fee2e2',
		200: '#fecaca',
		300: '#fca5a5',
		400: '#f87171',
		500: '#ef4444',
		600: '#dc2626',
		700: '#b91c1c',
		800: '#991b1b',
		900: '#7f1d1d',
		950: '#450a0a'
	},
	green: {
		50: '#f0fdf4',
		100: '#dcfce7',
		200: '#bbf7d0',
		300: '#86efac',
		400: '#4ade80',
		500: '#22c55e',
		600: '#16a34a',
		700: '#15803d',
		800: '#166534',
		900: '#14532d',
		950: '#052e16'
	},
	stone: {
		50: '#fafaf9',
		100: '#f5f5f4',
		200: '#e7e5e4',
		300: '#d6d3d1',
		400: '#a8a29e',
		500: '#78716c',
		600: '#57534e',
		700: '#44403c',
		800: '#292524',
		900: '#1c1917',
		950: '#0c0a09'
	},
	emerald: {
		50: '#ecfdf5',
		100: '#d1fae5',
		200: '#a7f3d0',
		300: '#6ee7b7',
		400: '#34d399',
		500: '#10b981',
		600: '#059669',
		700: '#047857',
		800: '#065f46',
		900: '#064e3b',
		950: '#022c22'
	},
	teal: {
		50: '#f0fdfa',
		100: '#ccfbf1',
		200: '#99f6e4',
		300: '#5eead4',
		400: '#2dd4bf',
		500: '#14b8a6',
		600: '#0d9488',
		700: '#0f766e',
		800: '#115e59',
		900: '#134e4a',
		950: '#042f2e'
	},
	slate: {
		50: '#f8fafc',
		100: '#f1f5f9',
		200: '#e2e8f0',
		300: '#cbd5e1',
		400: '#94a3b8',
		500: '#64748b',
		600: '#475569',
		700: '#334155',
		800: '#1e293b',
		900: '#0f172a',
		950: '#020617'
	},
	rose: {
		50: '#fff1f2',
		100: '#ffe4e6',
		200: '#fecdd3',
		300: '#fda4af',
		400: '#fb7185',
		500: '#f43f5e',
		600: '#e11d48',
		700: '#be123c',
		800: '#9f1239',
		900: '#881337',
		950: '#4c0519'
	},
	indigo: {
		50: '#eef2ff',
		100: '#e0e7ff',
		200: '#c7d2fe',
		300: '#a5b4fc',
		400: '#818cf8',
		500: '#6366f1',
		600: '#4f46e5',
		700: '#4338ca',
		800: '#3730a3',
		900: '#312e81',
		950: '#1e1b4b'
	}
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Inter', 'ui-sans-serif', 'system-ui'],
			mono: [
				'"JetBrains Mono"',
				'monospace',
			]
		},
		colors: {
			white: '#FFF',
			grey: {
				50: '#FAFAFB',
				100: '#F4F3F7',
				200: '#EEEDF1',
				300: '#E6E5EA',
				400: '#DEDDE4',
				500: '#BCBBC3',
				600: '#9997A3',
				700: '#797783',
				800: '#605E68',
				900: '#2D2B36',
				950: '#120E20'
			},
			hubspot: {
				50: '#FEF9F7',
				100: '#FEF0EB',
				200: '#FDD8CC',
				300: '#E09A80',
				500: '#FF7A59',
				600: '#E5603D',
				700: '#C13F0D',
			},
			violet: {
				50: '#F7F5FF',
				100: '#EFEBFF',
				200: '#E6E0FF',
				300: '#DDD1FF',
				400: '#C5B5FC',
				500: '#A693FB',
				600: '#8164F4',
				700: '#6847EB',
				800: '#4B25BB',
				900: '#3C1D91'
			},
			zinc: {
				50: '#FAFAFB',
				100: '#F4F3F7',
				200: '#EEEDF1',
				300: '#E6E5EA',
				400: '#DEDDE4',
				500: '#BCBBC3',
				600: '#9997A3',
				700: '#797783',
				800: '#605E68',
				900: '#2D2B36',
				950: '#120E20'
			},
			Warning: {
				50: '#FEF5E7',
				100: '#FCE2B6',
				200: '#FBD89D',
				300: '#F9C56d',
				600: '#C47E09',
				800: '#623F04'
			},
			amber: legacyColors.amber,
			orange: legacyColors.orange,
			pink: legacyColors.pink,
			blue: legacyColors.blue,
			sky: legacyColors.sky,
			red: legacyColors.red,
			green: legacyColors.green,
			stone: legacyColors.stone,
			emerald: legacyColors.emerald,
			teal: legacyColors.teal,
			transparent: 'transparent',
			slate: legacyColors.slate,
			rose: legacyColors.rose,
			indigo: legacyColors.indigo,
			Brand: {
				50: '#F7F5FF',
				100: '#EFEBFF',
				200: '#E6E0FF',
				300: '#DDD1FF',
				400: '#C5B5FC',
				500: '#A693FB',
				600: '#8164F4',
				700: '#6847EB',
				800: '#4B25BB',
				900: '#3C1D91',
				950: '#291466'
			},
			Error: {
				50: '#FEF2F3',
				100: '#FDE3E5',
				400: '#F5747F',
				500: '#E93544',
				600: '#D82A38',
				700: '#B5202C',
				800: '#961E28',
				900: '#7D1F27'
			},
		},
		extend: {}
	},
	plugins: [
		// Add colors as css variable
		function ({ addBase, theme }) {
			function extractColorVars(colorObj, colorGroup = '') {
				return Object.keys(colorObj).reduce((vars, colorKey) => {
					const value = colorObj[colorKey];

					const newVars =
						typeof value === 'string'
							? { [`--color${colorGroup}-${colorKey}`]: value }
							: extractColorVars(value, `-${colorKey}`);

					return { ...vars, ...newVars };
				}, {});
			}

			addBase({
				':root': extractColorVars(theme('colors'))
			});
		}
	]
};

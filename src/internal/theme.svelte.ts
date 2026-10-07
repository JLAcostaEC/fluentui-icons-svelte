export type ThemePreference = 'system' | 'light' | 'dark';

/** Same key the inline script in `app.html` reads, so the first paint already has the right theme. */
export const THEME_KEY = 'fluentui-icons-theme';

class ThemeState {
	preference = $state<ThemePreference>('system');
	#systemDark = $state(false);

	resolved = $derived<'light' | 'dark'>(
		this.preference === 'system' ? (this.#systemDark ? 'dark' : 'light') : this.preference
	);

	/** Reads the saved choice and follows the OS while the user has not picked one. Call from `onMount`. */
	init(): () => void {
		const query = matchMedia('(prefers-color-scheme: dark)');
		this.#systemDark = query.matches;
		try {
			const saved = localStorage.getItem(THEME_KEY);
			if (saved === 'light' || saved === 'dark') this.preference = saved;
		} catch {
			// Storage can be blocked; the preference then lasts for this visit only.
		}

		const onChange = (event: MediaQueryListEvent) => {
			this.#systemDark = event.matches;
			this.#apply();
		};
		query.addEventListener('change', onChange);
		this.#apply();
		return () => query.removeEventListener('change', onChange);
	}

	toggle() {
		this.preference = this.resolved === 'dark' ? 'light' : 'dark';
		try {
			localStorage.setItem(THEME_KEY, this.preference);
		} catch {
			// See init(): not persisting is fine.
		}
		this.#apply();
	}

	#apply() {
		const root = document.documentElement;
		root.classList.toggle('dark', this.resolved === 'dark');
		root.style.colorScheme = this.resolved;
	}
}

export const theme = new ThemeState();

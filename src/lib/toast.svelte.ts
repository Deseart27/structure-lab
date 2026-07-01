let message = $state('');
let timer: ReturnType<typeof setTimeout> | null = null;

export const toast = {
	get message() { return message; },
	show(msg: string, duration = 2000) {
		if (timer) clearTimeout(timer);
		message = msg;
		timer = setTimeout(() => { message = ''; }, duration);
	},
};

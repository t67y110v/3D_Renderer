async function _call_update() {
	if (typeof update === "function") {
		while (1) {
			frame_start_time = (new Date).getTime();
			update();
			await sleep(Math.max(1000 / properties.framerate - ((new Date).getTime() - frame_start_time), 0));
		}
	}
}
_call_update()

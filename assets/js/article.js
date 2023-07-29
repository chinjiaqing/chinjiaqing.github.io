function throttle(fn, delay = 10) {
	let t = null;
	return function () {
		let ctx = this;
		let args = arguments;
		if (!t) {
			t = setTimeout(() => {
				fn.apply(ctx, args);
				t = null;
			}, delay);
		}
	};
}

window.onload = () => {
	// 左侧
	const $topItems = document.querySelectorAll(".folder .item:not(.file)");

	const removeOpenClass = (children) => {
		let arr = Array.from(children);
		for (let child of arr) {
			child.classList.remove("open");
			if (child.children.length > 0) {
				removeOpenClass(child.children);
			}
		}
	};
	const bindFolderItemClick = (e) => {
		e.stopPropagation();
		let $e = e.target;
		if ($e.classList.contains("open")) {
			$e.classList.remove("open");
			removeOpenClass($e.children);
		} else {
			$e.classList.add("open");
		}
	};
	$topItems.forEach(($el) => {
		$el.addEventListener("click", bindFolderItemClick);
	});

	// const $main = document.querySelector(".right-content");
	// const $mask = document.querySelector(".mask");
	// let lastScrollTop = 0;
	// let mainWidth = $main.offsetWidth;
	// $mask.addEventListener("click", (e) => {
	// 	$main.classList.remove("fixed");
	// 	$main.style.width = "auto";
	// 	$mask.style.display = "none";
	// });
	// $main.addEventListener(
	// 	"scroll",
	// 	throttle((e) => {
	// 		let top = $main.scrollTop;
	// 		if (top > lastScrollTop) {
	// 			// 内容往上
	// 			if (top > 200) {
	// 				$main.classList.add("fixed");
	// 				$main.style.width = mainWidth + "px";
	// 				$mask.style.display = "block";
	// 			}
	// 		} else {
	// 			if (top < 200) {
	// 				$main.classList.remove("fixed");
	// 				$main.style.width = "auto";
	// 				$mask.style.display = "none";
	// 			}
	// 		}
	// 		lastScrollTop = top;
	// 	}, 200)
	// );
};

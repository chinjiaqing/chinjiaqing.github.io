window.onload = () => {
	// 左侧
	const ARTICLES = [];
	function handleFilterArticles(item) {
		if (item.type === "file") {
			ARTICLES.push({
				href: item.href,
				title: item.title,
			});
		} else {
			if (item.children && item.children.length) {
				for (let it of item.children) {
					handleFilterArticles(it);
				}
			}
		}
	}
	handleFilterArticles({ children: window.__ARTICLES__ });
	// const $topItems = document.querySelectorAll(".folder .item:not(.file)");
	const $topItems = document.querySelectorAll(".folder .item");

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
		let $e = e.target;
		console.log("%c [ e ]-32", "font-size:13px; background:pink; color:#bf2c9f;", e, $e);
		if ($e.classList.contains("file")) return;
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

	// 设置选中状态
	function setOpenState($ele) {
		if (!$ele) return;
		let parent = $ele.parentNode;
		if (parent.classList.contains("item")) {
			parent.classList.add("open");
			parent.classList.add("active");
			setOpenState(parent);
		} else {
			return false;
		}
	}
	const currentItem = document.querySelector(`.folder .item a[href="${decodeURIComponent(location.pathname)}"]`);
	currentItem && currentItem.classList.add("active");
	setOpenState(currentItem);

	const $input = document.querySelector(".input-area input ");
	const $options = document.querySelector(".input-area ul");
	$options &&
		$options.addEventListener("click", (e) => {
			let t = e.target;
			if (t.tagName.toLowerCase() === "li") {
				let href = t.getAttribute("data-href");
				window.location.href = window.location.href.replace(window.location.pathname, href);
			}
		});
	function handleInputChange(e) {
		const keyword = e.target.value;
		if (!keyword) {
			$options.innerHTML = "";
			return;
		}
		const list = ARTICLES.filter((e) => {
			return e.title.toLowerCase().includes(keyword.toLowerCase());
		});
		let html = "";
		for (let item of list) {
			html += `<li data-href="${item.href}">${item.title}</li>`;
		}
		$options.innerHTML = html;
	}
	$input && $input.addEventListener("input", handleInputChange);
	$input && $input.addEventListener("focus", handleInputChange);
	const clickEvent = document.createEvent("MouseEvents");
	clickEvent.initEvent("click", true, true);
	$input &&
		$input.addEventListener("keypress", (e) => {
			if (e.keyCode === 13) {
				let $li = $options.children[0] || null;
				$li && $li.dispatchEvent(clickEvent);
			}
		});
	$input &&
		$input.addEventListener("blur", (e) => {
			setTimeout(() => {
				$options.innerHTML = "";
			}, 300);
		});
};

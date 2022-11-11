function ibg() {
	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();

$('a[data-scroll]').on('click', function () {

	let href = $(this).attr('href');
	$('html, body').animate({
		scrollTop: $(href).offset().top - 120
	}, {
		duration: 500,   // по умолчанию «400»
		easing: "swing" // по умолчанию «swing»
	});

	return false;
});



// Динамический адаптив  -----------------------------------------------------------------------------
function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

// Динамический адаптив  -----------------------------------------------------------------------------


//Бургер =================================================================================================

const iconMenu = document.querySelector('._menu__icon');
const menuBody = document.querySelector('._menu__body');
const headeShadow = document.querySelector('.header-shadow');

if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
		let lockPaddingValue = window.innerWidth - document.querySelector('.wraper').offsetWidth + 'px';
		//bodyUnlock();
		if (document.body.classList.contains('_lock')) {
			//alert("Есть");
			document.body.classList.remove('_lock');
		} else {
			//alert("l")
			document.body.classList.add('_lock');
		}
	});
	headeShadow.addEventListener("click", function (e) {
		if (document.body.classList.contains('_lock')) {
			document.body.classList.remove('_lock');
			menuBody.classList.remove('_active');
			iconMenu.classList.remove('_active');
		}
	});
}

$('a[data-scroll]').click(function () {
	document.body.classList.remove('_lock');
	menuBody.classList.remove('_active');
	iconMenu.classList.remove('_active');
});

$(window).scroll(function () {
	if ($(window).scrollTop() > 300) {
		$('.header ').addClass('fixed');
	} else {
		$('.header ').removeClass('fixed');
	}
});

//======== Всплывающие окна =========================
$('a[data-popup]').click(function (e) {
	let namePopup = $(this).attr('href');
	$(namePopup).scrollTop(0);
	if ($('.popup').is(namePopup)) {
		$(namePopup).addClass('show');
		$('body').addClass('_lock');
	}
});
$('a[data-popup-id]').click(function () {
	let namePopup = $(this).attr('data-popup-id');
	if ($('.popup').is(namePopup)) {
		$(namePopup).addClass('show');
		$('body').addClass('_lock');
	}
});
$('.popup__close, .popup-close').click(function () {
	$('.popup').removeClass('show');
	$('body').removeClass('_lock');
});
$(document).mouseup(function (e) {
	let div = $(".popup__body");
	if (!div.is(e.target) && div.has(e.target).length === 0) {
		$('.popup').removeClass('show');
		$('body').removeClass('_lock');
	}
});

$('.faq-tab__item').click(function () {

	$('.faq-tab__item').removeClass('active')
	$(this).addClass('active')
});

$('.banner-header__close').click(function () {
	$(this).parents('.banner-header').addClass('hide')
});

$('#userPhoto').change(function (event) {
	let files = event.target.files;
	for (let i = 0, f; f = files[i]; i++) {
		let reader = new FileReader();
		reader.onload = (function (theFile) {
			return function (e) {
				let preview = document.querySelector(".file-input__image");
				let span = document.createElement('span');
				span.innerHTML = ['<img src="', e.target.result, '" />'].join('');
				preview.insertBefore(span, null);
			};
		})(f);
		reader.readAsDataURL(f);
	}
})
// Форма =================
$("form").each(function () {
	$(this).validate({
		rules: {
			user_name: {
				required: true,
				minlength: 3
			},
			user_tel: {
				required: true,
			},
		},
		invalidHandler: function (event, validator) {
			var errors = validator.numberOfInvalids();
			if (errors) {
				$(this).find(".invalid-feedback").addClass('show');
			} else {
				$(this).find(".invalid-feedback").removeClass('show');
			}
		},
		submitHandler: function (el) {
			let fd = new FormData(el);
			$.ajax({
				url: "/php/telegram/send.php",
				type: "POST",
				data: fd,
				processData: false,
				contentType: false,
				beforeSend: () => {
					$('.submit').addClass('spiner');
				},
				success: function success(respond) {
					$(el)[0].reset();
					$('.submit').removeClass('spiner');
					$('.popup').removeClass('show');
					$('#successForm').addClass('show');
				}
			});
			return false;
		}
	});
});


const mainSlider = new Swiper(".index-slaider__wrapper", {
	allowTouchMove: false,
	loop: true,
	autoplay: {
		delay: 3000,
		stopOnLastSlide: true,
	},
	keyboard: {
		enabled: true,
		onlyInViewport: false,
	},
});
const feedbacksSwiper = new Swiper("#feedbacksSlider", {
	loop: true,
	spaceBetween: 15,
	slidesPerView: "auto",
	navigation: {
		nextEl: ".feedbacks-button-next",
		prevEl: ".feedbacks-button-prev",
	},
	autoplay: {
		delay: 5000,
	},
	breakpoints: {
		640: {
			spaceBetween: 20,
			slidesPerView: 2,
		},
		1200: {
			spaceBetween: 30,
			slidesPerView: 3,
		},
	}
});
const swiper = new Swiper(".mySwiper", {
	loop: true,
	spaceBetween: 5,
	slidesPerView: 3,
	freeMode: true,
	watchSlidesProgress: true,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		640: {
			spaceBetween: 20,
			direction: "vertical",
		},
		1200: {
			direction: "vertical",
			spaceBetween: 30,
		},
	}
});
const swiper2 = new Swiper(".mySwiper2", {
	loop: true,
	spaceBetween: 10,

	thumbs: {
		swiper: swiper,
	},
});
const feedbacksSlider = new Swiper(".feedbackSlider", {
	spaceBetween: 5,
	slidesPerView: 1,
	freeMode: true,
	hashNavigation: {
		watchState: true,
	},
	navigation: {
		nextEl: ".feedbackSlider-next",
		prevEl: ".feedbackSlider-prev",
	},
});

var galleryBody = new Swiper(".gallery__body_1", {
	loop: true,
	spaceBetween: 30,
	navigation: {
		prevEl: ".gallery-buttons__left_1",
		nextEl: ".gallery-buttons__right_1",
	},

	breakpoints: {
		320.1: {
			slidesPerView: 1,
		},
		520.1: {
			slidesPerView: 2,
		},
		767.1: {
			slidesPerView: 3,
		},
	},
});

var galleryMb = new Swiper(".gallery__body_mb_1", {
	loop: true,
	spaceBetween: 30,
	slidesPerView: 1,
	navigation: {
		prevEl: ".gallery-buttons__left_1",
		nextEl: ".gallery-buttons__right_1",
	},
});

galleryBody.controller.control = galleryMb;
galleryMb.controller.control = galleryBody;





var galleryBody2 = new Swiper(".gallery__body_2", {
	loop: true,
	spaceBetween: 30,
	navigation: {
		prevEl: ".gallery-buttons__left_2",
		nextEl: ".gallery-buttons__right_2",
	},

	breakpoints: {
		320.1: {
			slidesPerView: 1,
		},
		520.1: {
			slidesPerView: 2,
		},
		767.1: {
			slidesPerView: 3,
		},
	},
});

var galleryMb2 = new Swiper(".gallery__body_mb_2", {
	loop: true,
	spaceBetween: 30,
	slidesPerView: 1,
	navigation: {
		prevEl: ".gallery-buttons__left_2",
		nextEl: ".gallery-buttons__right_2",
	},
});

galleryBody2.controller.control = galleryMb2;
galleryMb2.controller.control = galleryBody2;





var galleryBody3 = new Swiper(".gallery__body_3", {
	loop: true,
	spaceBetween: 30,
	navigation: {
		prevEl: ".gallery-buttons__left_3",
		nextEl: ".gallery-buttons__right_3",
	},

	breakpoints: {
		320.1: {
			slidesPerView: 1,
		},
		520.1: {
			slidesPerView: 2,
		},
		767.1: {
			slidesPerView: 3,
		},
	},
});

var galleryMb3 = new Swiper(".gallery__body_mb_3", {
	loop: true,
	spaceBetween: 30,
	slidesPerView: 1,
	navigation: {
		prevEl: ".gallery-buttons__left_3",
		nextEl: ".gallery-buttons__right_3",
	},
});

galleryBody3.controller.control = galleryMb3;
galleryMb3.controller.control = galleryBody3;


const Tab = document.querySelectorAll('._tab');

if (Tab.length > 0) {
	for (let i = 0; i < Tab.length; i++) {
		let TabLinks = Tab[i].querySelectorAll('._tab-link');
		let TabLinkBody = Tab[i].querySelectorAll('._tab-link-body');
		let TabWraper = Tab[i].querySelectorAll('._tab-wrapper');
		let TabBodys = Tab[i].querySelectorAll('._tab-body');
		for (let i = 0; i < TabLinks.length; i++) {
			let TabLink = TabLinks[i];

			TabLink.addEventListener("click", function (e) {
				e.preventDefault()
				for (let i = 0; i < TabLinks.length; i++) {
					if (TabLinks[i].classList.contains('_active')) {
						TabLinks[i].classList.remove('_active');
					}
				}
				TabLink.classList.toggle('_active');

				const blockID = TabLink.getAttribute('href').replace('#', '');

				if (blockID == "all") {
					for (let i = 0; i < TabBodys.length; i++) {
						if (TabBodys[i].classList.contains('hide')) {
							TabBodys[i].classList.remove('hide');
						}
					}
				} else {
					for (let i = 0; i < TabBodys.length; i++) {

						TabBodys[i].classList.add('hide');

						if (TabBodys[i].id == blockID) {
							TabBodys[i].classList.remove('hide');
						}
					}
				}
			});
		}
	}
}

var testSlider = new Swiper(".test-body-wrapper__index", {
	spaceBetween: 300,
	slidesPerView: 1,
	autoHeight: true,
	navigation: {
		prevEl: ".test-body-wrapper__button_left",
		nextEl: ".test-body-wrapper__button_right",
	},
	breakpoints: {
		319.1: {
			allowTouchMove: false,
			autoHeight: true,
		},
		767.1: {
			allowTouchMove: false,
			//autoHeight: false,
		},
	},
});

var sliderOne = document.getElementById('slider-one');

if (sliderOne) {
	noUiSlider.create(sliderOne, {
		start: [1, 20],
		connect: true,
		range: {
			'min': 1,
			'max': 300
		},
	});

	const sliderInput0 = document.getElementById('input_one-1');
	const sliderInput1 = document.getElementById('input_one-2');
	let inputsOne = [sliderInput0, sliderInput1];

	sliderOne.noUiSlider.on('update', function (values, handle) {
		inputsOne[handle].value = Math.round(values[handle]);
	});

	const setRangeSlider = (i, value) => {
		let arr = [null, null];
		arr[i] = value;
		sliderOne.noUiSlider.set(arr);
	};

	inputsOne.forEach((el, index) => {
		el.addEventListener('change', (e) => {
			setRangeSlider(index, e.currentTarget.value);
		});
	})
}

var sliderTwue = document.getElementById('slider-twue');

if (sliderTwue) {
	noUiSlider.create(sliderTwue, {
		start: 1,
		behaviour: 'snap',
		connect: [true, false],
		range: {
			'min': 1,
			'max': 10000
		}
	});

	const sliderInputTwue0 = document.getElementById('input_twue-1');
	let inputsThue = [sliderInputTwue0];

	sliderTwue.noUiSlider.on('update', function (values, handle) {
		inputsThue[handle].value = Math.round(values[handle]);
	});

	const setRangeSlider2 = (i, value) => {
		let arr = [null, null];
		arr[i] = value;
		sliderTwue.noUiSlider.set(arr);
	};

	inputsThue.forEach((el, index) => {
		el.addEventListener('change', (e) => {
			setRangeSlider2(index, e.currentTarget.value);
		});
	})
}

var sliderTrue = document.getElementById('slider-true');

if (sliderTrue) {
	noUiSlider.create(sliderTrue, {
		start: 1,
		behaviour: 'snap',
		connect: [true, false],
		range: {
			'min': 1,
			'max': 10000
		}
	});

	const sliderInputTrue0 = document.getElementById('input_true-1');
	let inputsTrue = [sliderInputTrue0];

	sliderTrue.noUiSlider.on('update', function (values, handle) {
		inputsTrue[handle].value = Math.round(values[handle]);
	});

	const setRangeSlider3 = (i, value) => {
		let arr = [null, null];
		arr[i] = value;
		sliderTrue.noUiSlider.set(arr);
	};

	inputsTrue.forEach((el, index) => {
		el.addEventListener('change', (e) => {
			setRangeSlider3(index, e.currentTarget.value);
		});
	})
}
document.addEventListener('DOMContentLoaded', function () {
	// конечная дата
	const deadline = new Date(new Date().getFullYear(), new Date().getMonth() + 1, -16);
	// id таймера
	let timerId = null;
	// склонение числительных
	function declensionNum(num, words) {
		return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
	}
	// вычисляем разницу дат и устанавливаем оставшееся времени в качестве содержимого элементов
	function countdownTimer() {
		const diff = deadline - new Date();
		//const diff = 200 - new Date();
		if (diff <= 0) {
			clearInterval(timerId);
		}
		const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
		const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
		const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
		const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
		$days.textContent = days < 10 ? '0' + days : days;
		$hours.textContent = hours < 10 ? '0' + hours : hours;
		$minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
		$seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
		$days.dataset.title = declensionNum(days, ['день', 'дня', 'дней']);
		$hours.dataset.title = declensionNum(hours, ['час', 'часа', 'часов']);
		$minutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']);
		$seconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
	}
	// получаем элементы, содержащие компоненты даты
	const $days = document.querySelector('.timer__days2');
	const $hours = document.querySelector('.timer__hours2');
	const $minutes = document.querySelector('.timer__minutes2');
	const $seconds = document.querySelector('.timer__seconds2');
	// вызываем функцию countdownTimer
	countdownTimer();
	// вызываем функцию countdownTimer каждую секунду
	timerId = setInterval(countdownTimer, 1000);
});

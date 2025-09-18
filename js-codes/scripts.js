document.addEventListener('DOMContentLoaded', () => {
	correctVh();
	dropdown();
	headerMenu();
	pageScroll();
	initSwiperCards();
	videoBlocks();
	gsapAnimations();
	contactForm();
});

window.addEventListener('resize', () => {
	correctVh();
});

window.addEventListener('scroll', () => {
	headerOnScroll();
});

function contactForm() {
	const btn = document.querySelector('#btn-contact');
	const form = document.querySelector('#contact-form');
	const firstName = document.querySelector('#input-first-name');
	const lastName = document.querySelector('#input-last-name');
	const email = document.querySelector('#input-email');
	const phone = document.querySelector('#input-phone');
	const company = document.querySelector('#input-company');
	const message = document.querySelector('#input-message');

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		if (validation()) {
			sendingForm();
		}
	});

	function validation() {
		let isValid = true;

		if (firstName.value.length === 0) {
			printErrorMessage(firstName, 'Please fill out this field.');
			isValid = false;
		} else {
			printErrorMessage(firstName, '');
		}

		if (lastName.value.length === 0) {
			printErrorMessage(lastName, 'Please fill out this field.');
			isValid = false;
		} else {
			printErrorMessage(lastName, '');
		}

		if (email.value.length > 0 && !validateEmail(email.value)) {
			printErrorMessage(email, 'Invalid email format.');
			isValid = false;
		} else if (email.value.length === 0) {
			printErrorMessage(email, 'Please fill out this field.');
			isValid = false;
		} else if (email.value.length > 0 && validateEmail(email.value)) {
			printErrorMessage(email, '');
		}

		if (phone.value.length === 0) {
			printErrorMessage(phone, 'Please fill out this field.');
			isValid = false;
		} else {
			printErrorMessage(phone, '');
		}

		return isValid;
	}

	function printErrorMessage(element, message) {
		element.parentNode.parentNode.parentNode.querySelector('.error-message').textContent = message;
	}

	function validateEmail(email) {
		let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	}

	email.addEventListener("input", function (event) {
		let input = event.target;
		input.value = input.value.replace(/[^a-zA-Z0-9@._-]/g, "");
	});

	phone.addEventListener("input", function (event) {
		let input = event.target;
		input.value = input.value.replace(/(?!^)\+/g, "").replace(/[^0-9+]/g, "");
	});


	function sendingForm() {
		btn.disabled = true;

		fetch(ajaxurl.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				phone: phone,
				email: email,
				company: company,
				message: message
			})
		})
			.then(response => response.json())
			.then(data => {
				const formMessage = document.querySelector('#form-message');

				if (data.status === 'error') {
					const errorHtml = data.errors.map(error =>
						`<div class="error-item">${error}</div>`
					).join('');
					formMessage.innerHTML = errorHtml;
				} else {
					formMessage.textContent = 'Your form has been successfully submitted. Thank you for getting in touch!';
				}
			})
			.catch(() => {
				document.querySelector('#form-message').textContent = 'An error occurred while submitting the form. Try again later.';
			})
			.finally(() => {

				btn.disabled = false;
			});
	}
}


function headerOnScroll() {
	const scroll = window.scrollY;
	const header = document.querySelector('.site-header');
	if (scroll >= 60) {
		header.classList.add("scrolled");
	} else {
		header.classList.remove("scrolled");
	}
}


function initSwiperCards() {
	const swiperCards = new Swiper(".swiper-cards", {
		slidesPerView: "auto",
		spaceBetween: 30,
		speed: 400,
	});
}

function headerMenu() {
	const btnOpen = document.querySelector('.btn-menu-open');
	const btnClose = document.querySelector('.btn-menu-close');

	if (btnOpen) {
		btnOpen.addEventListener('click', () => {
			document.body.classList.add('menu-opened');
		});
	}

	if (btnClose) {
		btnClose.addEventListener('click', () => {
			document.body.classList.remove('menu-opened');
		});
	}

	document.querySelector('.header-menu-holder').addEventListener('click', function (event) {
		if (!event.target.closest('.inner-holder')) {
			document.body.classList.remove('menu-opened');
		}
	});
}

function correctVh() {
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', vh + 'px');
}

function dropdown() {
	const activeClass = 'show';
	const select = '[data-lang-select]';

	document.addEventListener('click', function (e) {
		let shareEl = e.target.closest(select);
		if (!shareEl && e.target.classList.contains(select)) {
			shareEl = e.target;
		} else if (shareEl) {
			shareEl.classList.toggle(activeClass);
		}

		document.querySelectorAll(select + '.' + activeClass).forEach(el => {
			if (!shareEl || el !== shareEl) {
				el.classList.remove(activeClass);
			}
		});
	});
}

function videoBlocks() {
	const blocks = document.querySelectorAll('[data-video-block]');

	if (blocks.length > 0) {
		blocks.forEach((block) => {
			block.addEventListener('click', () => {
				if (block.classList.contains('playning')) {
					block.querySelector('video').pause();
					block.classList.remove('playning');
				} else {
					block.querySelector('video').play();
					block.classList.add('playning');
				}
			});
		})
	}
}



function pageScroll() {
	gsap.registerPlugin(ScrollTrigger);

	// Select all panels
	const panelWrappers = document.querySelectorAll(".smooth-scroll-page");

	if (panelWrappers.length > 0) {
		panelWrappers.forEach((wrapper) => {
			ScrollTrigger.matchMedia({
				"(min-width: 992px)": () => {
					// const panels = gsap.utils.toArray(wrapper.querySelectorAll("[data-scroll-section]"));
					const panels = gsap.utils.toArray("[data-scroll-section]", wrapper);
					const scrollNormalizer = ScrollTrigger.normalizeScroll(true);
					let activeScroll = null;

					document.addEventListener(
						"touchstart",
						(e) => {
							if (activeScroll) {
								e.preventDefault();
								e.stopImmediatePropagation();
							}
						},
						{ capture: true, passive: false }
					);

					panels.forEach((panel, index) => {
						ScrollTrigger.create({
							trigger: panel,
							start: "top bottom",
							end: "+=199%",
							onToggle: (self) => {
								if (self.isActive && !activeScroll) {
									activeScroll = gsap.to(window, {
										scrollTo: { y: index * window.innerHeight, autoKill: false },
										onStart: () => {
											scrollNormalizer.disable();
											scrollNormalizer.enable();
										},
										duration: 0.8,
										onComplete: () => {
											activeScroll = null;
										},
										overwrite: true,
									});
								}
							},
						});


						ScrollTrigger.create({
							trigger: panel,
							start: () =>
								panel.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
							pin: true,
							pinSpacing: index === panels.length - 1,
							scrub: true,
						});
					});

					const scrollToButtons = document.querySelectorAll("[scroll-to]");
					scrollToButtons.forEach((button) => {
						button.addEventListener("click", (e) => {
							e.preventDefault();

							document.body.classList.remove('menu-opened');
							const targetId = button.getAttribute("scroll-to");
							let targetIndex = panels.findIndex((panel) => panel.id === targetId);

							if (targetIndex !== -1) {
								activeScroll = gsap.to(window, {
									scrollTo: { y: targetIndex * window.innerHeight, autoKill: false },
									onStart: () => {
										scrollNormalizer.disable();
										scrollNormalizer.enable();
									},
									duration: 0.8,
									onComplete: () => {
										activeScroll = null;
									},
									overwrite: true,
								});
							}
						});
					});
				},

				// For smaller screens (less than 992px) you can implement custom behavior if needed
				"(max-width: 991px)": () => {
					const scrolls = document.querySelectorAll("[scroll-to]");

					if (scrolls) {
						for (const scroll of scrolls) {
							scroll.addEventListener("click", clickHandler);
						}

						function clickHandler(e) {
							document.body.classList.remove('menu-opened');
							e.preventDefault();
							const dataScroll = this.getAttribute("scroll-to");
							const targetElement = document.querySelector(`#${dataScroll}`);

							if (targetElement) {
								gsap.to(window, {
									scrollTo: {
										y: targetElement,
										offsetY: 0,
										autoKill: false
									},
									duration: 0.8,
									ease: "power2.out",
									onStart: () => {
										ScrollTrigger.getAll().forEach((trigger) => trigger.disable());
									},
									onComplete: () => {
										ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
									}
								});
							}
						}
					}
				},
			});
		});
	}



}



function gsapAnimations() {
	if (document.querySelector('.page-home')) {
		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-intro'),
				start: "top 80%",
				end: "top 60%",
				toggleActions: "play none none none",
			},
		})
			.to(".clipped-box .clipped-text", {
				y: 0,
				stagger: 0.05,
				delay: 0.2,
				duration: .45
			})
			.fromTo(".section-intro .section-footer",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.45 },
				"<"
			)
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			}, "+=0.3")
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			});



		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-about'),
				start: "top 50%",
				end: "top 80%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".section-about .block-about",
				{ y: 150, opacity: 0, },
				{ y: 0, opacity: 1, duration: 1, delay: 0.1 }
			)
			.fromTo(".section-about .headding-2",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .75, },
				"<"
			).to(document.querySelector('.section-about .glitch-text'), {
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-about .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-about .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-about .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-about .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			})
			.fromTo(".section-about .decor-line",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"0"
			)
			.fromTo(".section-about .text-holder",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: 1.15, },
				"<"
			)
			.fromTo(".section-about .decor-white-block",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: 1.15, },
				"<"
			);



		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-preysight'),
				start: "top 50%",
				end: "top 80%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".section-preysight .headding-2",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .75, },
				"<"
			)
			.to(document.querySelector('.section-preysight .glitch-text'), {
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			}, "+=0.1")
			.to(document.querySelector('.section-preysight .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-preysight .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-preysight .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-preysight .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			})
			.fromTo(".section-preysight .text-holder",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: 1.15, },
				"0"
			)
			.fromTo(".section-preysight .btn-primary",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"<"
			)
			.fromTo(".section-preysight .img-holder-1",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: 0.8, },
				"<"
			)
			.fromTo(".section-preysight .img-holder-2",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: 1.25, },
				"<"
			)
			.fromTo(".section-preysight .img-holder-3",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: 1.35, },
				"<"
			);



		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-choose-us'),
				start: "top 50%",
				end: "top 80%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".section-choose-us .headding-2",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .75, },
				"<"
			)
			.to(document.querySelector('.section-choose-us .glitch-text'), {
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
				color: "white",
			})
			.to(document.querySelector('.section-choose-us .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-choose-us .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-choose-us .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-choose-us .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				duration: 0.2,
				ease: "power2.inOut",
			}).fromTo(".section-choose-us .swiper-slide",
				{ y: 50, opacity: 0 },
				{ y: 0, opacity: 1, duration: 1.15, stagger: 0.15 },
				"0"
			);

		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-contact'),
				start: "top 50%",
				end: "top 80%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".section-contact .headding-2",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .75, },
				"<"
			)
			.to(document.querySelector('.section-contact .glitch-text'), {
				delay: 0.1,
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
				color: "white",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			})
			.fromTo(".section-contact .section-text",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"0"
			)
			.fromTo(".section-contact .link-mail",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"0"
			)
			.fromTo(".section-contact .right-side",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"0"
			)
			.fromTo(".section-contact .block-input, .section-contact .btn-holder",
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 1.15, stagger: 0.1 },
				"0"
			);
	}



	if (document.querySelector('.page-blog')) {
		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.page-blog'),
				start: "top 50%",
				end: "top 80%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".page-blog .headding-1",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .75, },
				"<"
			)
			.to(document.querySelector('.page-blog .glitch-text'), {
				delay: 0.1,
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
				color: "white",
			})
			.to(document.querySelector('.page-blog .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.page-blog .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.page-blog .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.page-blog .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			});


		gsap.set(".page-blog .card-blog", { y: 100, opacity: 0 });
		ScrollTrigger.batch(".page-blog .card-blog", {
			onEnter: batch => gsap.to(batch, { delay: 0.1, autoAlpha: 1, y: 0, opacity: 1, stagger: 0.15, duration: 0.6, }),
			scrollTrigger: {
				start: "top 60%",
				trigger: document.querySelector(".page-blog")
			}
		});

		gsap.from(".page-blog .nav-pagination", {
			y: 50,
			opacity: 0,
			duration: 0.55,
			stagger: 0.5,
			scrollTrigger: {
				start: "top 60%",
				trigger: document.querySelector(".page-blog .nav-pagination")
			}
		});
	}

	if (document.querySelector('.page-404')) {
		gsap.set(".page-404 .fadeInUp", { y: 50, opacity: 0, autoAlpha: 0 });
		ScrollTrigger.batch(".page-404 .fadeInUp", {
			onEnter: batch => gsap.to(batch, { delay: 0.1, autoAlpha: 1, y: 0, opacity: 1, stagger: 0.15, duration: 0.6, }),
			start: "top 90%",
			end: "top 100%",
			trigger: ".page-404",
			once: true,
			batchMax: 6,
		});
	}

	if (document.querySelector('.page-text')) {
		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.page-text'),
				start: "top 50%",
				end: "top 80%",
				toggleActions: "play none none none",
			},
		}).fromTo(".page-text .container",
			{ y: 50, opacity: 0, },
			{ y: 0, opacity: 1, duration: .75, },
			"<"
		)
			.to(document.querySelector('.page-text .glitch-text'), {
				delay: 0.1,
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
				color: "white",
			})
			.to(document.querySelector('.page-text .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.page-text .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.page-text .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.page-text .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			});
	}


	if (document.querySelector('.page-blog-post')) {
		gsap.set(".page-blog-post .fadeInUp", { y: 50, opacity: 0, autoAlpha: 0 });
		ScrollTrigger.batch(".page-blog-post .fadeInUp", {
			onEnter: batch => gsap.to(batch, { delay: 0.1, autoAlpha: 1, y: 0, opacity: 1, stagger: 0.15, duration: 0.6, }),
			start: "top 90%",
			end: "top 100%",
			trigger: ".page-blog-post",
			once: true,
			batchMax: 6,
		});
	}

	if (document.querySelector('.page-product')) {
		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-intro'),
				start: "top 80%",
				end: "top 60%",
				toggleActions: "play none none none",
			},
		})
			.to(".clipped-box .clipped-text", {
				y: 0,
				stagger: 0.05,
				delay: 0.2,
				duration: .45
			})
			.fromTo(".section-intro .section-footer",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.45 },
				"<"
			)
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			}, "+=0.3")
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-intro .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			});


		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-vision'),
				start: "top 80%",
				end: "top 60%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".section-vision .block-background",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 1.25 },
				"<"
			)
			.fromTo(".section-vision .headding-3",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.55, delay: 0.1 },
				"<"
			)
			.fromTo(".section-vision .text-holder",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.55, delay: 0.1 },
				"<"
			)
			.to(document.querySelector('.section-vision .glitch-text'), {
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-vision .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-vision .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-vision .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-vision .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			})
			.fromTo(".section-vision .img-holder:first-of-type",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.75, delay: 0.1 },
				"0"
			)
			.fromTo(".section-vision .img-holder:last-of-type",
				{ y: 50, opacity: 0 },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.75, delay: 0.2 },
				"0"
			);


		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-gallery'),
				start: "top 80%",
				end: "top 60%",
				toggleActions: "play none none none",
			},
		}).fromTo(".section-gallery .img-holder, .section-gallery .video-holder",
			{ opacity: 0, scale: 0, },
			{ scale: 1, opacity: 1, stagger: 0.05, duration: 0.75, delay: 0.1 },
			"0"
		);



		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-technology'),
				start: "top 80%",
				end: "top 60%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".section-technology .block-content",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 1.25 },
				"<"
			)
			.fromTo(".section-technology .headding-3",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.55, delay: 0.1 },
				"<"
			)
			.fromTo(".section-technology .right-side .text-holder",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.55, delay: 0.1 },
				"<"
			)
			.to(document.querySelector('.section-technology .glitch-text'), {
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-technology .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-technology .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-technology .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-technology .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			})
			.fromTo(".section-technology .card-info",
				{ opacity: 0, y: 80, },
				{ y: 0, opacity: 1, stagger: 0.15, duration: 0.55, delay: 0.1 },
				"0"
			);

		gsap.timeline({
			scrollTrigger: {
				trigger: document.querySelector('.section-contact'),
				start: "top 50%",
				end: "top 80%",
				toggleActions: "play none none none",
			},
		})
			.fromTo(".section-contact .headding-2",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .75, },
				"<"
			)
			.to(document.querySelector('.section-contact .glitch-text'), {
				delay: 0.1,
				textShadow: "2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
				color: "white",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "-2px 0 0 #00ff00",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "-2px 0 0 #ff0000",
				duration: 0.1,
				ease: "power2.inOut",
			})
			.to(document.querySelector('.section-contact .glitch-text'), {
				textShadow: "0px 0px 0px transparent",
				color: "#EC2426",
				duration: 0.2,
				ease: "power2.inOut",
			})
			.fromTo(".section-contact .section-text",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"0"
			)
			.fromTo(".section-contact .link-mail",
				{ y: 80, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"0"
			)
			.fromTo(".section-contact .right-side",
				{ y: 50, opacity: 0, },
				{ y: 0, opacity: 1, duration: .95, },
				"0"
			)
			.fromTo(".section-contact .block-input, .section-contact .btn-holder",
				{ opacity: 0, y: 50 },
				{ opacity: 1, y: 0, duration: 1.15, stagger: 0.1 },
				"0"
			);

	}

}






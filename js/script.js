"use strict";

const header = document.querySelector(".header");
const headerButton = header.querySelector(".header__button");

header.classList.toggle("header--nojs");
header.classList.toggle("header--open");

const onMenuClose = function (e) {
  e.preventDefault();

  if (!e.code || e.code === "Escape") header.classList.toggle("header--open");

  if (header.classList.contains("header--open")) {
    document.addEventListener("keydown", onMenuClose);
  }

  if (!header.classList.contains("header--open")) {
    document.removeEventListener("keydown", onMenuClose);
  }
};

headerButton.addEventListener("click", onMenuClose);

const tabs = document.querySelectorAll(".tabs__content-item");
const tabsButtons = document.querySelectorAll(".tabs__button");

["hashchange", "load"].forEach((evt) => {
  window.addEventListener(evt, (e) => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    const target = document.querySelector(`#${id}`);

    if ([...tabs].includes(target)) {
      tabs.forEach((tab) => tab.classList.remove("tabs__content-item--active"));
      target.classList.add("tabs__content-item--active");

      tabsButtons.forEach((button) => {
        button.classList.remove("tabs__button--active");

        if (button.hash === `#${id}`)
          button.classList.add("tabs__button--active");
      });
    }

    target.scrollIntoView({ behavior: "smooth" });
  });
});

const page = document.querySelector(".page");
const modalButtons = document.querySelectorAll("a[href='#modal']");
const modalClose = document.querySelector(".modal__close");
const modal = document.querySelector("#modal");
const inputPhone = modal.querySelector(".modal .form__phone");
const overlay = modal.querySelector(".modal__overlay");

const openModal = function () {
  modal.classList.add("modal--active");
  page.classList.add("page--modal");

  inputPhone.focus();
  document.addEventListener("keydown", closeModal);
  modalClose.addEventListener("click", closeModal);
};

const closeModal = function (e) {
  if (e.key && e.key !== "Escape") return;

  page.classList.remove("page--modal");
  modal.classList.remove("modal--active");
  document.removeEventListener("keydown", closeModal);
  modalClose.removeEventListener("click", closeModal);
};

overlay.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal__overlay")) closeModal(e);
});

modalButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    e.preventDefault();

    openModal();
  })
);

const modalMessage = document.querySelector(".modal__message");

const validateForm = function (form) {
  const localStorage = window.localStorage;
  const inputEmail = form.querySelector(".form__email");
  const inputPhone = form.querySelector(".form__phone");

  form.addEventListener("input", () => {
    localStorage.setItem(`${form.classList[0]}.phone`, inputPhone.value);
    localStorage.setItem(`${form.classList[0]}.email`, inputEmail.value);
  });

  window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem(`${form.classList[0]}.email`))
      inputEmail.value = localStorage.getItem(`${form.classList[0]}.email`);
    if (localStorage.getItem(`${form.classList[0]}.phone`))
      inputPhone.value = localStorage.getItem(`${form.classList[0]}.phone`);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    modalMessage.classList.add("modal__message--open");
    openModal();
  });

  [inputPhone, inputEmail].forEach((input) => {
    input.addEventListener("invalid", (e) => {
      e.preventDefault();

      const err = input.closest(".form__label").querySelector(".form__err");
      err.textContent = "Данные не верны";
    });
  });

  [inputPhone, inputEmail].forEach((input) => {
    input.addEventListener("valid", (e) => {
      e.preventDefault();

      const err = input.closest(".form__label").querySelector(".form__err");
      err.textContent = " ";
    });
  });
};

validateForm(document.querySelector(".modal__form"));
validateForm(document.querySelector(".question__form"));

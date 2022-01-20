class Slider {
  constructor(id, cycle = 3000) {
    this.container = document.getElementById(id);
    this.sliderItems = this.container.querySelectorAll(
      ".slider-list-item, .slider-list-item-selected"
    );
    this.cycle = cycle;
  }

  registerPlugins(...plugins) {
    plugins.forEach((plugin) => plugin(this));
  }

  getSelectedItem() {
    return this.container.querySelector(".slider-list-item-selected");
  }
  getSelectedItemIndex() {
    return Array.from(this.sliderItems).indexOf(this.getSelectedItem());
  }

  slideTo(index) {
    const selectedItem = this.getSelectedItem();
    if (selectedItem) {
      selectedItem.className = "slider-list-item";
    }

    const item = this.sliderItems[index];
    if (item) {
      item.className = "slider-list-item-selected";
    }

    const detail = { index: index };
    const slideEvent = new CustomEvent("slide", { bubbles: true, detail });
    this.container.dispatchEvent(slideEvent);
  }

  slideNext() {
    const currentIndex = this.getSelectedItemIndex();
    const nextIndex = (currentIndex + 1) % this.sliderItems.length;
    this.slideTo(nextIndex);
  }

  slidePrevious() {
    const currentIndex = this.getSelectedItemIndex();
    const previousIndex =
      (currentIndex - 1 + this.sliderItems.length) % this.sliderItems.length;
    this.slideTo(previousIndex);
  }

  start() {
    this.stop();
    this._timer = setInterval(() => this.slideNext(), this.cycle);
  }

  stop() {
    clearInterval(this._timer);
  }
}

function pluginController(slider) {
  const controller = slider.container.querySelector(".slider-list-controller");
  if (controller) {
    const buttons = controller.querySelectorAll(
      ".slider-list-controller-button, .slider-list-controller-button-selected"
    );
    controller.addEventListener("mouseover", (event) => {
      const index = Array.from(buttons).indexOf(event.target);
      if (index >= 0) {
        slider.slideTo(index);
        slider.stop();
      }
    });

    controller.addEventListener("mouseout", (event) => {
      slider.start();
    });

    // CustomEvent "slide"
    slider.container.addEventListener("slide", (event) => {
      const index = event.detail.index;
      const selected = controller.querySelector(
        ".slider-list-controller-button-selected"
      );
      if (selected) {
        selected.className = "slider-list-controller-button";
      }
      buttons[index].className = "slider-list-controller-button-selected";
    });
  }
}

function pluginPrevious(slider) {
  const previous = slider.container.querySelector(".slider-list-previous");
  if (previous) {
    previous.addEventListener("click", (event) => {
      slider.stop();
      slider.slidePrevious();
      slider.start();
      event.preventDefault();
    });
  }
}

function pluginNext(slider) {
  const next = slider.container.querySelector(".slider-list-next");
  if (next) {
    next.addEventListener("click", (event) => {
      slider.stop();
      slider.slideNext();
      slider.start();
      event.preventDefault();
    });
  }
}

const slider = new Slider("slider-container");
slider.registerPlugins(pluginController, pluginPrevious, pluginNext);
slider.start();

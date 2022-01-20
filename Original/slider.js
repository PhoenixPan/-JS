console.log("loaded");

class Slider {
  constructor(id, cycle = 3000) {
    this.container = document.getElementById(id);
    this.items = this.container.querySelectorAll(
      ".slider-list-item, .slider-list-item-selected"
    );
    this.cycle = cycle;

    const controller = this.container.querySelector(".slider-list-controller");
    if (controller) {
      const buttons = controller.querySelectorAll(
        ".slider-list-controller-button, .slider-list-controller-button-selected"
      );
      controller.addEventListener("mouseover", (event) => {
        const index = Array.from(buttons).indexOf(event.target);
        if (index >= 0) {
          this.slideTo(index);
          this.stop();
        }
      });

      controller.addEventListener("mouseout", (event) => {
        this.start();
      });

      // CustomEvent "slide"
      this.container.addEventListener("slide", (event) => {
        const index = event.detail.index;
        const selected = controller.querySelector(
          ".slider-list-controller-button-selected"
        );
        if (selected) {
          selected.className = "slider-list-controller-button";
        }
        buttons[index].className = "slider-list-controller-button-selected";
      });

      const previous = this.container.querySelector(".slider-list-previous");
      if (previous) {
        previous.addEventListener("click", (event) => {
          this.stop();
          this.slidePrevious();
          this.start();
          event.preventDefault();
        });
      }

      const next = this.container.querySelector(".slider-list-next");
      if (next) {
        next.addEventListener("click", (event) => {
          this.stop();
          this.slideNext();
          this.start();
          event.preventDefault();
        });
      }
    }
  }

  getSelectedItem() {
    return this.container.querySelector(".slider-list-item-selected");
  }
  getSelectedItemIndex() {
    return Array.from(this.items).indexOf(this.getSelectedItem());
  }

  slideTo(index) {
    const selectedItem = this.getSelectedItem();
    if (selectedItem) {
      selectedItem.className = "slider-list-item";
    }

    const item = this.items[index];
    if (item) {
      item.className = "slider-list-item-selected";
    }

    const detail = { index: index };
    const slideEvent = new CustomEvent("slide", { bubbles: true, detail });
    this.container.dispatchEvent(slideEvent);
  }

  slideNext() {
    const currentIndex = this.getSelectedItemIndex();
    const nextIndex = (currentIndex + 1) % this.items.length;
    this.slideTo(nextIndex);
  }

  slidePrevious() {
    const currentIndex = this.getSelectedItemIndex();
    const previousIndex =
      (currentIndex - 1 + this.items.length) % this.items.length;
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

const slider = new Slider("slider-container");
slider.start();

class Slider {
  constructor(id, images, cycle = 3000) {
    this.container = document.getElementById(id);
    this.images = images;
    this.cycle = cycle;
    this.container.innerHTML = this.render();

    this.sliderItems = this.container.querySelectorAll(
      ".slider-list-item, .slider-list-item-selected"
    );
    this.slideTo(0);
  }

  render() {
    const content = this.images.map((image) => {
      return `<li class="slider-list-item"><img src="${image}" /></li>`.trim();
    });
    return `<ul class="slider-list">${content.join("")}</ul>`;
  }

  registerPlugins(...plugins) {
    plugins.forEach((plugin) => {
      //render() has to return a DOM node, cannot be html string
      this.container.appendChild(plugin.render(this.images));
      plugin.action(this);
    });
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

const pluginController = {
  // Create controller component
  render(images) {
    const node = document.createElement("div");
    node.className = "slider-list-controller";
    node.innerHTML = `
    <div class="slider-list-controller">
    ${images
      .map(() => {
        return `<span class="slider-list-controller-button"></span>`.trim();
      })
      .join("")}
    </div>
    `;
    return node;
  },

  // Add controller functionalities
  action(slider) {
    const controller = slider.container.querySelector(
      ".slider-list-controller"
    );
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

      // Listen to the CustomEvent "slide"
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
  },
};

const pluginPrevious = {
  // Create previous button component
  render() {
    const node = document.createElement("a");
    node.className = "slider-list-previous";
    return node;
  },
  // Add click on previous functionalities
  action(slider) {
    const previous = slider.container.querySelector(".slider-list-previous");
    if (previous) {
      previous.addEventListener("click", (event) => {
        slider.stop();
        slider.slidePrevious();
        slider.start();
        event.preventDefault();
      });
    }
  },
};

const pluginNext = {
  // Create next button component
  render() {
    const node = document.createElement("a");
    node.className = "slider-list-next";
    return node;
  },
  // Add click on next functionalities
  action(slider) {
    const next = slider.container.querySelector(".slider-list-next");
    if (next) {
      next.addEventListener("click", (event) => {
        slider.stop();
        slider.slideNext();
        slider.start();
        event.preventDefault();
      });
    }
  },
};

const sourceImages = [
  "https://img14.360buyimg.com/babel/s1180x940_jfs/t1/131849/12/22310/85916/61dfa129E9a107743/759a0e090cc457b9.png.webp",
  "https://img30.360buyimg.com/pop/s1180x940_jfs/t1/137552/28/17988/72976/60c061d3Ebcbc0822/0d8040478396d717.jpg.webp",
  "https://img30.360buyimg.com/pop/s1180x940_jfs/t1/181991/27/8369/65436/60c0633dE6e4df7a0/64fbd3d99fcdcc8c.jpg.webp",
  "https://imgcps.jd.com/ling4/3337468/5b-D5b-D5b-15b-155qE6Zu26aOf/54iG5qy-55u06ZmN/p-5bd8253082acdd181d02fa71/597d2731/cr/s/q.jpg",
];

const slider = new Slider("slider-container", sourceImages);
slider.registerPlugins(pluginController, pluginPrevious, pluginNext);
slider.start();

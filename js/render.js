const renderObj = {};

(function () {
  const amountSlider = document.getElementById("loan-amount-range");
  const durationSlider = document.getElementById("loan-duration-range");
  const interestSlider = document.getElementById("loan-interest-range");
  const sliderArray = [amountSlider, durationSlider, interestSlider];

  const amountInput = document.getElementById("loan-amount-input");
  const durationInput = document.getElementById("loan-duration-input");
  const interestInput = document.getElementById("loan-interest-input");
  const inputArray = [amountInput, durationInput, interestInput];

  function updateInputVal(inputEl, rangeSliderEl) {
    // set range slider's default value to input's default value
    inputEl.value = rangeSliderEl.value;

    // update input value on slider change
    rangeSliderEl.addEventListener("input", function (event) {
      inputEl.value = event.target.value;
    });

    inputEl.addEventListener("change", function (event) {
      if (event.target.value !== "") {
        if (
          Math.floor(event.target.value) >
          Math.floor(rangeSliderEl.getAttribute("max"))
        ) {
          event.target.value = rangeSliderEl.getAttribute("max");
        } else if (
          Math.floor(event.target.value) <
          Math.floor(rangeSliderEl.getAttribute("min"))
        ) {
          event.target.value = rangeSliderEl.getAttribute("min");
        }
      } else {
        event.target.value = rangeSliderEl.getAttribute("min");
        rangeSliderEl.value = event.target.value;
      }

      rangeSliderEl.value = event.target.value;
    });

    inputEl.addEventListener("input", function (event) {
      if (event.target.value !== "") {
        rangeSliderEl.value = event.target.value;
      } else {
        rangeSliderEl.value = rangeSliderEl.getAttribute("min");
      }
      console.log(event.target.value, rangeSliderEl.value);
    });
  }

  renderObj.updateInputVal = updateInputVal;

  if (inputArray.length === sliderArray.length) {
    for (let i = 0; i < inputArray.length; i++) {
      renderObj.updateInputVal(inputArray[i], sliderArray[i]);
    }
  }
})();

// Object.freeze(renderObj);

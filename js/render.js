const renderObj = {};

(function () {
  const amountSlider = document.getElementById("loan-amount-range");
  const amountInput = document.getElementById("loan-amount-input");
  let amount = amountSlider.value;

  const durationSlider = document.getElementById("loan-duration-range");
  const durationInput = document.getElementById("loan-duration-input");

  const interestSlider = document.getElementById("loan-interest-range");
  const interestInput = document.getElementById("loan-interest-input");

  const emiAmountEl = document.getElementById("monthly-emi-amount");

  let calcData = {
    amount: amountSlider.value,
    duration: durationSlider.value,
    interestRate: interestSlider.value,
  };

  renderObj.emiData = calculateEMI(
    parseFloat(calcData.amount),
    parseFloat(calcData.duration),
    parseFloat(calcData.interestRate)
  );

  emiAmountEl.innerText = "₹" + Math.round(renderObj.emiData.emi) + "*";

  const ctx = document.getElementById("myChart");
  const chartOptions = {
    type: "pie",
    data: {
      datasets: [
        {
          data: [
            renderObj.emiData.totalAmount,
            renderObj.emiData.totalInterest,
          ],
        },
      ],
    },
    options: {},
  };
  const pieChart = new Chart(ctx, chartOptions);

  function calculateEMI(principalAmount, numberOfYears, interestPercent) {
    let durationInMonths = numberOfYears * 12;
    let interestRatePerMonth = interestPercent / 12 / 100;

    let emiAmount =
      (principalAmount *
        interestRatePerMonth *
        Math.pow(1 + interestRatePerMonth, durationInMonths)) /
      (Math.pow(1 + interestRatePerMonth, durationInMonths) - 1);

    let totalPayableAmount = emiAmount * durationInMonths;
    let totalInterestPayable = totalPayableAmount - principalAmount;

    return {
      emi: emiAmount,
      totalAmount: totalPayableAmount,
      totalInterest: totalInterestPayable,
    };
  }

  renderObj.calcData = calcData;

  function updateInputVal(inputEl, rangeSliderEl) {
    // set range slider's default value to input's default value
    inputEl.value = rangeSliderEl.value;

    // update input value on slider change
    rangeSliderEl.addEventListener("input", function (event) {
      inputEl.value = event.target.value;

      if (this.classList.contains("loan-amount-range")) {
        renderObj.calcData.amount = this.value;
      } else if (this.classList.contains("loan-duration-range")) {
        renderObj.calcData.duration = this.value;
      } else {
        renderObj.calcData.interestRate = this.value;
      }

      renderObj.emiData = calculateEMI(
        parseFloat(calcData.amount),
        parseFloat(calcData.duration),
        parseFloat(calcData.interestRate)
      );

      emiAmountEl.innerText = "₹" + Math.round(renderObj.emiData.emi) + "*";
      pieChart.update();
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
      console.log(amount, rangeSliderEl.value);
    });

    inputEl.addEventListener("input", function (event) {
      if (event.target.value !== "") {
        rangeSliderEl.value = event.target.value;
      } else {
        rangeSliderEl.value = rangeSliderEl.getAttribute("min");
      }
    });
  }

  renderObj.updateInputVal = updateInputVal;

  renderObj.updateInputVal(amountInput, amountSlider);
  renderObj.updateInputVal(durationInput, durationSlider);
  renderObj.updateInputVal(interestInput, interestSlider);
})();

console.log(renderObj);
// Object.freeze(renderObj);

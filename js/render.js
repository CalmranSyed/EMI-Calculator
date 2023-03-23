const renderObj = {};

(function () {
  // HTML elements
  const amountSlider = document.getElementById("loan-amount-range");
  const amountInput = document.getElementById("loan-amount-input");
  let amount = amountSlider.value;

  const durationSlider = document.getElementById("loan-duration-range");
  const durationInput = document.getElementById("loan-duration-input");

  const interestSlider = document.getElementById("loan-interest-range");
  const interestInput = document.getElementById("loan-interest-input");

  const emiAmountEl = document.getElementById("monthly-emi-amount");
  const totalAmountEl = document.getElementById("total-amount-payable");
  const totalInterestEl = document.getElementById("total-interest-payable");

  const chartContainerEl = document.getElementById("chart-container");

  // inputed data from the calc
  renderObj.calcData = {
    amount: amountSlider.value,
    duration: durationSlider.value,
    interestRate: interestSlider.value,
  };

  // calculated EMI data from the initial calc data
  renderObj.emiData = calculateEMI(
    parseFloat(renderObj.calcData.amount),
    parseFloat(renderObj.calcData.duration),
    parseFloat(renderObj.calcData.interestRate)
  );

  // render EMI data from the inital input data
  renderEmiData(
    renderObj.emiData.emi,
    renderObj.emiData.totalAmount,
    renderObj.emiData.totalInterest
  );

  // colors for pie chart and wherever else needed
  renderObj.color = {
    yellow: "#d8e024",
    blue: "#2e93eb",
  };

  // options for the graph / pie-chart
  const chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    credits: { enabled: false },

    title: {
      text: "",
      align: "left",
    },
    tooltip: {
      enabled: false,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
      },
      series: {
        enableMouseTracking: false,
      },
    },
    series: [
      {
        name: "Brands",
        colorByPoint: true,
        data: [
          {
            name:
              "Total Amount Payable <br>₹" +
              Math.round(renderObj.emiData.totalAmount) +
              "*",
            y: renderObj.emiData.totalAmount,
            sliced: true,
            selected: true,
            color: renderObj.color.blue,
          },
          {
            name:
              "Total Interest Payable <br>₹" +
              Math.round(renderObj.emiData.totalInterest) +
              "*",
            y: renderObj.emiData.totalInterest,
            color: renderObj.color.yellow,
          },
        ],
      },
    ],
    exporting: false,
  };

  const chartObj = renderChart(chartContainerEl, chartOptions);

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

  function renderChart(chartEl, chartOptions) {
    return Highcharts.chart(chartEl, chartOptions);
  }

  function renderEmiData(emiAmount, totalAmount, interestAmount) {
    emiAmountEl.innerText =
      "₹" + Math.round(emiAmount).toLocaleString("en-IN") + "*";

    totalAmountEl.innerText =
      "₹" + Math.round(totalAmount).toLocaleString("en-IN") + "*";

    totalInterestEl.innerText =
      "₹" + Math.round(interestAmount).toLocaleString("en-IN") + "*";
  }

  function checkInputClass(inputEl, className, updatedData) {
    if (inputEl.classList.contains(className)) {
      updatedData = inputEl.value;
      console.log(inputEl, className, updatedData);
    }
  }

  function updateInputVal(inputEl, rangeSliderEl) {
    // set range slider's default value to input's default value
    inputEl.value = rangeSliderEl.value;

    // update input value on slider change
    rangeSliderEl.addEventListener("input", function (event) {
      inputEl.value = event.target.value;

      // checkInputClass(this, "loan-amount-range", renderObj.calcData.amount);

      // checkInputClass(this, "loan-duration-range", renderObj.calcData.duration);

      // checkInputClass(
      //   this,
      //   "loan-interest-range",
      //   renderObj.calcData.interestRate
      // );

      if (this.classList.contains("loan-amount-range")) {
        renderObj.calcData.amount = this.value;
      } else if (this.classList.contains("loan-duration-range")) {
        renderObj.calcData.duration = this.value;
      } else {
        renderObj.calcData.interestRate = this.value;
      }

      renderObj.emiData = calculateEMI(
        Number(renderObj.calcData.amount),
        Number(renderObj.calcData.duration),
        Number(renderObj.calcData.interestRate)
      );

      renderEmiData(
        renderObj.emiData.emi,
        renderObj.emiData.totalAmount,
        renderObj.emiData.totalInterest
      );

      chartOptions.series[0].data[0].y = renderObj.emiData.totalAmount;
      chartOptions.series[0].data[1].y = renderObj.emiData.totalInterest;
      Highcharts.chart(chartContainerEl, chartOptions);

      console.log(renderObj.calcData);
    });

    // update slider value on input change
    inputEl.addEventListener("change", function (event) {
      if (event.target.value !== "") {
        // when input value is less than slider min val
        if (
          Math.floor(event.target.value) >
          Math.floor(rangeSliderEl.getAttribute("max"))
        ) {
          event.target.value = rangeSliderEl.getAttribute("max");
        }

        // when input value is less than slider min val
        else if (
          Math.floor(event.target.value) <
          Math.floor(rangeSliderEl.getAttribute("min"))
        ) {
          event.target.value = rangeSliderEl.getAttribute("min");
        }
      }

      // when input value is empty
      else {
        event.target.value = rangeSliderEl.getAttribute("min");
        rangeSliderEl.value = event.target.value;

        if (this.classList.contains("loan-amount-input")) {
          renderObj.calcData.amount = this.value;
        } else if (this.classList.contains("loan-duration-input")) {
          renderObj.calcData.duration = this.value;
        } else {
          renderObj.calcData.interestRate = this.value;
        }
      }

      rangeSliderEl.value = event.target.value;

      renderObj.emiData = calculateEMI(
        parseFloat(renderObj.calcData.amount),
        parseFloat(renderObj.calcData.duration),
        parseFloat(renderObj.calcData.interestRate)
      );

      renderEmiData(
        renderObj.emiData.emi,
        renderObj.emiData.totalAmount,
        renderObj.emiData.totalInterest
      );

      chartOptions.series[0].data[0].y = renderObj.emiData.totalAmount;
      chartOptions.series[0].data[1].y = renderObj.emiData.totalInterest;
      Highcharts.chart(chartContainerEl, chartOptions);

      console.log(renderObj.calcData);
    });

    // update slider value on input value change
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

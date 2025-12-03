// choices.js
// Custom multi-select UI with circles on the right of each option
// Works on all <select> elements inside #dynamicCategoryFilters

document.addEventListener("DOMContentLoaded", () => {
  const dynamicContainer = document.getElementById("dynamicCategoryFilters");
  if (!dynamicContainer) return;

  function initCustomMultiSelect(select) {
    // Avoid double-init
    if (select.dataset.hsMsInit === "1") return;
    select.dataset.hsMsInit = "1";

    // Wrap
    const wrapper = document.createElement("div");
    wrapper.className = "hs-ms-wrapper";

    // Display
    const display = document.createElement("div");
    display.className = "hs-ms-display";

    const placeholderSpan = document.createElement("span");
    placeholderSpan.className = "hs-ms-placeholder";
    placeholderSpan.textContent = select.previousElementSibling && select.previousElementSibling.tagName === "LABEL"
      ? `Select ${select.previousElementSibling.textContent.replace(":", "").trim()}`
      : "Select options";

    const countSpan = document.createElement("span");
    countSpan.className = "hs-ms-count";
    countSpan.style.display = "none";

    display.appendChild(placeholderSpan);
    display.appendChild(countSpan);

    // Options list
    const list = document.createElement("div");
    list.className = "hs-ms-options";
    list.style.display = "none";

    // Mark original select as hidden for UI
    select.classList.add("hs-ms-original-select");

    // Build options
    const options = Array.from(select.options);
    options.forEach((opt, index) => {
      const value = opt.value !== "" ? opt.value : opt.textContent.trim();
      const text = opt.textContent.trim();

      const optionDiv = document.createElement("div");
      optionDiv.className = "hs-ms-option";
      optionDiv.dataset.value = value;

      const labelSpan = document.createElement("span");
      labelSpan.textContent = text;

      const circleSpan = document.createElement("span");
      circleSpan.className = "hs-ms-circle";

      optionDiv.appendChild(labelSpan);
      optionDiv.appendChild(circleSpan);

      // Click behaviour
      optionDiv.addEventListener("click", (e) => {
        e.stopPropagation();

        // "All" behaviour: clear others
        const isAll =
          index === 0 &&
          text.toLowerCase() === "all";

        if (isAll) {
          // Clear all selections
          options.forEach(o => o.selected = false);
          Array.from(list.children).forEach(child => child.classList.remove("selected"));

          // Just treat "All" as "no filter" (nothing selected)
          updateDisplay();
          return;
        }

        // Toggle this option
        const currentlySelected = optionDiv.classList.contains("selected");
        optionDiv.classList.toggle("selected", !currentlySelected);

        // Mirror to <select> options
        options[index].selected = !currentlySelected;

        // Make sure the first option ("All") is effectively off when others are selected
        if (options[0] && options[0].textContent.trim().toLowerCase() === "all") {
          options[0].selected = false;
        }

        updateDisplay();
      });

      list.appendChild(optionDiv);
    });

    // Update the display text / count
    function updateDisplay() {
      const selectedOptions = options.filter(o => o.selected);
      if (selectedOptions.length === 0) {
        placeholderSpan.style.display = "inline";
        countSpan.style.display = "none";
      } else if (selectedOptions.length === 1) {
        placeholderSpan.style.display = "none";
        countSpan.style.display = "inline";
        countSpan.textContent = selectedOptions[0].textContent.trim();
      } else {
        placeholderSpan.style.display = "none";
        countSpan.style.display = "inline";
        countSpan.textContent = `${selectedOptions.length} selected`;
      }
    }

    // Toggle dropdown open/close
    display.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = list.style.display === "block";
      document.querySelectorAll(".hs-ms-options").forEach(el => el.style.display = "none");
      list.style.display = isOpen ? "none" : "block";
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
      list.style.display = "none";
    });

    // Insert wrapper around the select
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(display);
    wrapper.appendChild(list);
    wrapper.appendChild(select);

    // Initial sync
    updateDisplay();
  }

  function initAllSelectsIn(container) {
    const selects = container.querySelectorAll("select");
    selects.forEach((select) => {
      // Make them logically multi-select
      select.multiple = true;
      initCustomMultiSelect(select);
    });
  }

  // Run on current content
  initAllSelectsIn(dynamicContainer);

  // Watch for category changes (templates being cloned in)
  const observer = new MutationObserver(() => {
    initAllSelectsIn(dynamicContainer);
  });

  observer.observe(dynamicContainer, {
    childList: true,
    subtree: true
  });
});

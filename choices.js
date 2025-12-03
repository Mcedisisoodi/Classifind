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

    // Make it logically multi-select
    select.multiple = true;

    // Wrap
    const wrapper = document.createElement("div");
    wrapper.className = "hs-ms-wrapper";

    // Display
    const display = document.createElement("div");
    display.className = "hs-ms-display";

    const placeholderSpan = document.createElement("span");
    placeholderSpan.className = "hs-ms-placeholder";
    placeholderSpan.textContent =
      select.previousElementSibling &&
      select.previousElementSibling.tagName === "LABEL"
        ? `Select ${select.previousElementSibling.textContent
            .replace(":", "")
            .trim()}`
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

    // Hide original select visually but keep it for logic
    select.classList.add("hs-ms-original-select");

    const options = Array.from(select.options);

    options.forEach((opt, index) => {
      const value = opt.value !== "" ? opt.value : opt.textContent.trim();
      const text = opt.textContent.trim();

      const optionDiv = document.createElement("div");
      optionDiv.className = "hs-ms-option";
      optionDiv.dataset.value = value;

      const labelSpan = document.createElement("span");
      // labelSpan.textContent = text; // Replaced with innerHTML logic below
      
      const count = opt.dataset.count;
      labelSpan.innerHTML = text + (count ? ` <span style="color: #A88905; font-weight: bold; margin-left: 4px;">${count}</span>` : "");

      const circleSpan = document.createElement("span");
      circleSpan.className = "hs-ms-circle";

      optionDiv.appendChild(labelSpan);
      optionDiv.appendChild(circleSpan);

      optionDiv.addEventListener("click", (e) => {
        e.stopPropagation();

        const isAll =
          index === 0 && text.toLowerCase().startsWith("all");

        if (isAll) {
          const alreadySelected = optionDiv.classList.contains("selected");

          // If already selected, unselect "All"
          if (alreadySelected) {
            optionDiv.classList.remove("selected");
            options[index].selected = false;
          } else {
            // Select ONLY "All", clear others
            options.forEach((o) => (o.selected = false));
            Array.from(list.children).forEach((child) =>
              child.classList.remove("selected")
            );

            optionDiv.classList.add("selected");
            options[index].selected = true;
          }

          updateDisplay();
          select.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }

        // Normal options: toggle
        const currentlySelected = optionDiv.classList.contains("selected");
        optionDiv.classList.toggle("selected", !currentlySelected);
        options[index].selected = !currentlySelected;

        // If "All" exists as first option, clear it when a specific is chosen
        if (
          options[0] &&
          options[0].textContent.trim().toLowerCase().startsWith("all")
        ) {
          options[0].selected = false;
          const firstChild = list.children[0];
          if (firstChild) firstChild.classList.remove("selected");
        }

        updateDisplay();
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      list.appendChild(optionDiv);
    });

    function updateDisplay() {
      const selectedOptions = options.filter((o) => o.selected);

      if (selectedOptions.length === 0) {
        // Nothing selected
        placeholderSpan.style.display = "inline";
        countSpan.style.display = "none";
      } else if (selectedOptions.length === 1) {
        // Single selection – show its text (including "All")
        placeholderSpan.style.display = "none";
        countSpan.style.display = "inline";
        countSpan.textContent = selectedOptions[0].textContent.trim();
      } else {
        // Multiple selected
        placeholderSpan.style.display = "none";
        countSpan.style.display = "inline";
        countSpan.textContent = `${selectedOptions.length} selected`;
      }
    }

    // Toggle dropdown
    display.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = list.style.display === "block";
      document
        .querySelectorAll(".hs-ms-options")
        .forEach((el) => (el.style.display = "none"));
      list.style.display = isOpen ? "none" : "block";
    });

    // Close on outside click
    document.addEventListener("click", () => {
      list.style.display = "none";
    });

    // Insert wrapper
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(display);
    wrapper.appendChild(list);
    wrapper.appendChild(select);

    // Initial display
    updateDisplay();
  }

  function initAllSelectsIn(container) {
    const selects = container.querySelectorAll("select");
    selects.forEach((select) => initCustomMultiSelect(select));
  }

  // Run on current content
  initAllSelectsIn(dynamicContainer);

  // Watch for category filter templates being injected
  const observer = new MutationObserver(() => {
    initAllSelectsIn(dynamicContainer);
  });

  observer.observe(dynamicContainer, {
    childList: true,
    subtree: true
  });
});

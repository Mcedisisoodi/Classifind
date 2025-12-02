// choices.js
// Enable multi-select dropdowns for all category-specific filters
// (everything rendered inside #dynamicCategoryFilters)

document.addEventListener("DOMContentLoaded", () => {
  const dynamicContainer = document.getElementById("dynamicCategoryFilters");

  if (!dynamicContainer) return;

  // Turn <select> elements into multi-select Choices widgets
  function enhanceSelectsIn(container) {
    const selects = container.querySelectorAll("select");

    selects.forEach((select) => {
      // Avoid re-initialising the same select
      if (select.dataset.choices === "active") return;

      select.dataset.choices = "active";

      // Turn into a multi-select
      select.multiple = true;

      // Treat "All" as a placeholder if it exists as the first option
      const firstOption = select.options[0];
      if (firstOption && firstOption.textContent.trim().toLowerCase() === "all") {
        // Optional: keep as disabled placeholder
        firstOption.value = "";
        firstOption.disabled = true;
        firstOption.selected = false;
      }

      // Initialise Choices on this select
      new Choices(select, {
        removeItemButton: true,
        searchEnabled: true,
        placeholder: true,
        placeholderValue: firstOption ? firstOption.textContent : "Select options",
        itemSelectText: "",
        shouldSort: false
      });
    });
  }

  // Run once in case something is already inside dynamicCategoryFilters
  enhanceSelectsIn(dynamicContainer);

  // Watch for template content being injected when category changes
  const observer = new MutationObserver(() => {
    enhanceSelectsIn(dynamicContainer);
  });

  observer.observe(dynamicContainer, {
    childList: true,
    subtree: true
  });
});

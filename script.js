/**
 * WCAG 2.1 AA Demo — script.js
 * ===============================
 * Three self-contained modules:
 *  1. Modal — focus trap, Escape key, aria-hidden toggle
 *  2. Form  — client-side validation with aria-live announcements
 *  3. Table — sortable columns with aria-sort updates
 *
 * No libraries. No frameworks. Plain, readable ES6.
 *
 * SC references are cited at the point of each technique.
 */

'use strict';

/* ============================================================
   UTILITIES
   ============================================================ */

/**
 * Returns all focusable elements within a given container.
 * Used by the focus trap to build the cycle list.
 *
 * We query common interactive element selectors. We must also
 * exclude disabled and hidden elements — they are not actually
 * reachable by keyboard even if they match the selector.
 *
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selectors)).filter(
    (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]')
  );
}


/* ============================================================
   MODULE 1: MODAL / FOCUS TRAP
   SC 2.1.1 — Keyboard Operable
   SC 2.1.2 — No Keyboard Trap (intentional trap when modal is open,
               per W3C ARIA Authoring Practices Guide Dialog pattern)
   SC 4.1.2 — Name, Role, Value
   ============================================================ */

(function initModal() {
  const overlay     = document.getElementById('modal-overlay');
  const dialog      = document.getElementById('modal-dialog');
  const openBtn     = document.getElementById('open-modal-btn');
  const closeBtn    = document.getElementById('close-modal-btn');

  if (!overlay || !dialog || !openBtn || !closeBtn) return;

  /**
   * Opens the modal.
   *
   * Steps (per APG Dialog pattern):
   * 1. Remove aria-hidden so the dialog enters the accessibility tree.
   * 2. Add the visual open class.
   * 3. Move focus to the first focusable element inside the dialog.
   *    - Do NOT focus the dialog div itself unless there are no focusable
   *      children — screen readers would read the entire dialog content,
   *      which is overwhelming.
   *
   * SC 4.1.2: state change is communicated via aria-hidden toggle.
   */
  function openModal() {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');

    // Inert: a standard alternative to aria-hidden on body siblings.
    // Supported in modern browsers. Prevents keyboard and AT reach of
    // background content without the need for aria-hidden on every sibling.
    document.querySelector('header').setAttribute('inert', '');
    document.querySelector('main').setAttribute('inert', '');
    document.querySelector('footer').setAttribute('inert', '');

    // Focus the first focusable element inside the dialog
    const focusableEls = getFocusableElements(dialog);
    if (focusableEls.length) {
      focusableEls[0].focus();
    } else {
      dialog.focus(); // Fallback: focus the dialog itself (tabindex="-1")
    }

    // Bind the keydown handler while modal is open
    document.addEventListener('keydown', handleModalKeydown);
  }

  /**
   * Closes the modal.
   *
   * Key behaviour: return focus to the element that triggered the modal.
   * If we do not do this, keyboard users lose their place in the page —
   * focus would fall back to the top of the document. SC 2.4.3.
   */
  function closeModal() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');

    // Remove inert from background content
    document.querySelector('header').removeAttribute('inert');
    document.querySelector('main').removeAttribute('inert');
    document.querySelector('footer').removeAttribute('inert');

    // Return focus to the trigger that opened the modal
    openBtn.focus();

    document.removeEventListener('keydown', handleModalKeydown);
  }

  /**
   * Keyboard handler for modal interactions.
   *
   * Escape: close the modal (standard dialog pattern). SC 2.1.1.
   * Tab / Shift+Tab: implement the focus trap. SC 2.1.2.
   *
   * Focus trap logic:
   * - If Tab is pressed on the last focusable element, wrap to the first.
   * - If Shift+Tab is pressed on the first focusable element, wrap to the last.
   * This keeps focus within the modal dialog at all times while it is open.
   *
   * @param {KeyboardEvent} event
   */
  function handleModalKeydown(event) {
    const focusableEls  = getFocusableElements(dialog);
    const firstFocusable = focusableEls[0];
    const lastFocusable  = focusableEls[focusableEls.length - 1];

    if (event.key === 'Escape') {
      // SC 2.1.1: Escape key must close dialogs
      closeModal();
      return;
    }

    if (event.key === 'Tab') {
      if (focusableEls.length === 0) {
        // No focusable children — keep focus on dialog div
        event.preventDefault();
        return;
      }

      if (event.shiftKey) {
        // Shift+Tab: moving backward
        if (document.activeElement === firstFocusable) {
          event.preventDefault(); // Intercept browser default
          lastFocusable.focus();  // Wrap to end
        }
      } else {
        // Tab: moving forward
        if (document.activeElement === lastFocusable) {
          event.preventDefault(); // Intercept browser default
          firstFocusable.focus(); // Wrap to start
        }
      }
    }
  }

  // Event: open button click
  openBtn.addEventListener('click', openModal);

  // Event: close button click
  closeBtn.addEventListener('click', closeModal);

  // Event: click on overlay background closes modal
  // We check the target to ensure we only close when the overlay
  // itself (not its children/dialog) is clicked.
  overlay.addEventListener('click', function(event) {
    if (event.target === overlay) {
      closeModal();
    }
  });
})();


/* ============================================================
   MODULE 2: FORM VALIDATION WITH ARIA-LIVE ANNOUNCEMENTS
   SC 3.3.1 — Error Identification
   SC 3.3.2 — Labels or Instructions
   SC 3.3.3 — Error Suggestion
   SC 4.1.3 — Status Messages
   ============================================================ */

(function initFormValidation() {
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (!form) return;

  /**
   * Validates a single field and updates its error state.
   *
   * The pattern:
   * 1. Check the condition.
   * 2. If invalid: set aria-invalid="true" on the input, inject the
   *    error message into the field's error container (linked via
   *    aria-describedby). The aria-live="polite" region announces it.
   * 3. If valid: remove aria-invalid, clear the error container.
   *
   * aria-invalid="true": SC 4.1.2 — communicates form control state.
   * aria-live injection: SC 4.1.3 — status message without focus move.
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} field
   * @returns {boolean} true if valid
   */
  function validateField(field) {
    const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
    let   message = '';

    // Clear previous error before re-validating
    clearFieldError(field, errorEl);

    switch (field.id) {
      case 'name':
        if (!field.value.trim()) {
          message = 'Full Name is required. Please enter your name.';
        } else if (field.value.trim().length < 2) {
          message = 'Name must be at least 2 characters.';
        }
        break;

      case 'email':
        if (!field.value.trim()) {
          message = 'Email Address is required. Please enter your email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          /*
            We use a permissive email regex rather than the RFC 5322
            full spec — over-strict validation fails real addresses.
            The browser's type="email" already does basic checking.
          */
          message = 'Please enter a valid email address (e.g. name@example.com).';
        }
        break;

      case 'message':
        if (!field.value.trim()) {
          message = 'Message is required. Please enter your message.';
        } else if (field.value.trim().length < 10) {
          message = 'Message must be at least 10 characters.';
        }
        break;
    }

    if (message) {
      setFieldError(field, errorEl, message);
      return false;
    }

    return true;
  }

  /**
   * Sets error state on a field.
   * @param {HTMLElement} field
   * @param {HTMLElement} errorEl
   * @param {string}      message
   */
  function setFieldError(field, errorEl, message) {
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      /*
        Injecting text into the aria-live container triggers a screen
        reader announcement. The announcement is "polite" — it waits for
        current speech to finish before reading the error.
        SC 3.3.1, SC 4.1.3.
      */
      errorEl.textContent = message;
    }
  }

  /**
   * Clears error state from a field.
   * @param {HTMLElement} field
   * @param {HTMLElement} errorEl
   */
  function clearFieldError(field, errorEl) {
    field.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  /**
   * Validates all fields on submit.
   * Focuses the first invalid field so keyboard users can immediately
   * address the error, rather than having to hunt for it. SC 3.3.1.
   */
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent actual submission in this demo

    const fields = [
      document.getElementById('name'),
      document.getElementById('email'),
      document.getElementById('message'),
    ];

    const results = fields.map(validateField);
    const firstInvalidField = fields.find((_, i) => !results[i]);

    if (firstInvalidField) {
      /*
        Moving focus to the first invalid field gives keyboard and screen
        reader users a clear starting point. SC 3.3.1.
        We do NOT use alert() — it is modal, disruptive, and inaccessible.
      */
      firstInvalidField.focus();

      // Announce a summary into the form-level live region
      formStatus.className = 'form-status error';
      formStatus.textContent =
        'Form submission failed. Please correct the errors indicated below each field.';
    } else {
      // All valid — simulate success
      formStatus.className = 'form-status success';
      formStatus.textContent =
        'Thank you! Your message has been sent successfully.';
      form.reset();
    }
  });

  /*
    Validate on blur (when the user leaves a field). This provides
    early feedback without being intrusive.
    We do NOT validate on every keystroke — that creates excessive
    interruptions for screen reader users (SC 3.3.1 intent).
  */
  ['name', 'email', 'message'].forEach(function(id) {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('blur', function() {
        // Only validate if the field has been touched (has a value or was blurred empty)
        validateField(field);
      });
    }
  });
})();


/* ============================================================
   MODULE 3: SORTABLE TABLE
   SC 1.3.1 — Info and Relationships
   SC 4.1.2 — Name, Role, Value (aria-sort)
   SC 4.1.3 — Status Messages (live region announcement)
   ============================================================ */

(function initSortableTable() {
  const table         = document.getElementById('courses-table');
  const tbody         = document.getElementById('courses-tbody');
  const announcer     = document.getElementById('table-announce');
  const sortButtons   = document.querySelectorAll('.sort-btn');

  if (!table || !tbody || !announcer) return;

  /**
   * Tracks the current sort state.
   * col: index of the sorted column (-1 = unsorted)
   * dir: 'asc' | 'desc'
   */
  let sortState = { col: -1, dir: 'asc' };

  /**
   * Sorts the table by a given column index.
   * Toggles ascending/descending on repeated clicks of the same column.
   *
   * After sorting:
   * 1. Update aria-sort on all <th> elements.
   * 2. Inject a description into the off-screen live region.
   *    This gives screen reader users feedback equivalent to the
   *    visual sort icon. SC 4.1.2, SC 4.1.3.
   *
   * @param {number} colIndex
   * @param {HTMLElement} clickedTh
   */
  function sortTable(colIndex, clickedTh) {
    // Determine sort direction
    if (sortState.col === colIndex) {
      // Same column: toggle direction
      sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
    } else {
      // New column: always start ascending
      sortState.col = colIndex;
      sortState.dir = 'asc';
    }

    const ascending = sortState.dir === 'asc';

    // --- Update DOM: sort rows ---
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort(function(rowA, rowB) {
      const cellA = rowA.cells[colIndex].textContent.trim();
      const cellB = rowB.cells[colIndex].textContent.trim();

      /*
        Numeric sort for columns that look like numbers.
        parseFloat returns NaN for non-numeric strings, which we handle
        by falling back to locale-aware string comparison.
      */
      const numA = parseFloat(cellA);
      const numB = parseFloat(cellB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return ascending ? numA - numB : numB - numA;
      }

      return ascending
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    // Re-append sorted rows
    rows.forEach((row) => tbody.appendChild(row));

    // --- Update ARIA: aria-sort on column headers ---
    // First reset all headers to "none"
    table.querySelectorAll('th[aria-sort]').forEach(function(th) {
      th.setAttribute('aria-sort', 'none');
    });

    // Set the active header to the correct direction
    clickedTh.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');

    // --- Announce to screen readers via live region ---
    // The announcement is in plain language, not ARIA jargon.
    // e.g., "Table sorted by Course Name, ascending."
    const columnName = clickedTh.querySelector('.sort-btn').firstChild.textContent.trim();
    const dirText    = ascending ? 'ascending' : 'descending';

    /*
      We briefly clear the live region before setting new text.
      This forces screen readers that cache the old value to re-announce,
      even if the text is identical (e.g., sorting same column twice).
    */
    announcer.textContent = '';
    // Use setTimeout to ensure the clear is processed before the new text
    setTimeout(function() {
      announcer.textContent = `Table sorted by ${columnName}, ${dirText}.`;
    }, 100);
  }

  // Attach click handlers to each sort button
  sortButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      /*
        btn.closest('th') walks up the DOM to find the parent <th>.
        We need the <th> to update aria-sort (the attribute must be on
        the header cell, not the button, per the ARIA table spec).
      */
      const th       = btn.closest('th');
      const colIndex = parseInt(btn.dataset.col, 10);

      if (th && !isNaN(colIndex)) {
        sortTable(colIndex, th);
      }
    });
  });
})();

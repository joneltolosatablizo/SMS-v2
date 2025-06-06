document.addEventListener('DOMContentLoaded', () => {
    const deleteModal = document.getElementById("delete-modal");
    const deleteForm = document.getElementById("delete-form");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const confirmCheckbox = document.getElementById("confirm-checkbox");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const gradeTable = document.getElementById("grade-table");

    let gradeIdToDelete = null;

    function getCSRFToken() {
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
        return '';
    }

    // Trigger modal from table buttons
    if (gradeTable) {
        gradeTable.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON" && e.target.textContent === "Delete") {
                e.preventDefault();
                const row = e.target.closest("tr");
                const gradeIdMatch = row.querySelector("a[href*='/edit/']").getAttribute("href").match(/\d+/);
                if (gradeIdMatch) {
                    gradeIdToDelete = gradeIdMatch[0];
                    confirmDeleteBtn.disabled = true;
                    confirmCheckbox.checked = false;
                    deleteModal.style.display = "block";
                }
            }
        });
    }

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        gradeIdToDelete = null;
    });

    confirmCheckbox.addEventListener('change', () => {
        confirmDeleteBtn.disabled = !confirmCheckbox.checked;
    });

    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!gradeIdToDelete) return;

        fetch(`${API_BASE_URL}api/grades/${gradeIdToDelete}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        })
        .then(response => {
            if (response.ok) {
              window.location.reload();
            } else {
                alert("Failed to delete grade.");
            }
        });
    });
});

// Инициализация календаря
function initCalendar(courseOptions, container) {
    const calendarInput = document.getElementById('calendarInput');

    // Настраиваем Flatpickr
    const fp = flatpickr(calendarInput, {
        locale: 'ru',
        mode: 'single',
        dateFormat: 'd.m.Y',
        minDate: 'today',
        onChange: function(selectedDates, dateStr, instance) {
            // При выборе даты можно добавить логику
            console.log('Выбрана дата:', dateStr);
        }
    });

    // Создаем выпадающий список курсов
    const select = document.createElement('select');
    select.className = 'w-full p-3 border rounded-lg mb-4';
    select.innerHTML = '<option value="">Выберите курс</option>' +
        courseOptions.map(option => `
            <option value="${option.value}" data-end-date="${option.endDate.toISOString()}">
                ${option.label} (заканчивается ${option.endDate.toLocaleDateString('ru-RU')})
            </option>
        `).join('');

    select.addEventListener('change', () => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption.value) {
            const endDate = new Date(selectedOption.dataset.endDate);
            updateCalendar(endDate);
        }
    });

    // Добавляем элементы на страницу
    container.innerHTML = '';
    container.appendChild(select);
    container.appendChild(calendarInput);
}

// Обновление календаря с новой датой
function updateCalendar(endDate) {
    const calendarInput = document.getElementById('calendarInput');
    const fp = calendarInput._flatpickr;

    // Обновляем выделенную дату
    fp.setDate(endDate);

    // Добавляем маркер на дату окончания
    fp.config.onDayCreate = function(dObj, dStr, fp, dayElem) {
        if (dayElem.dateObj.toDateString() === endDate.toDateString()) {
            dayElem.classList.add('bg-red-500', 'text-white', 'rounded-full');
            dayElem.innerHTML += '<div class="tooltip">Дата окончания курса</div>';
        }
    };

    fp.redraw();
}
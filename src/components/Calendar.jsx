import PropTypes from 'prop-types';
import cn from '@/utils/cn';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({
  defaultValue,
  onChange,
  className = '',
  inputClassName = '',
  placeholder = 'Select a date',
}) => {
  const dropdownRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (defaultValue) {
      const date = new Date(defaultValue);
      return !isNaN(date.getTime()) ? date : null;
    }
    return null;
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = useCallback(
    (date) => {
      setSelectedDate(date);
      if (onChange) {
        onChange(date);
      }
      setIsOpen(false);
    },
    [onChange]
  );

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const generateCalendarDays = useCallback(() => {
    const days = [];
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const totalDays = daysInMonth(currentMonth);

    // Adjust to start from Saturday (6) instead of Sunday (0)
    let startDay = start.getDay() - 1;
    if (startDay === -1) startDay = 6;

    // Previous month days
    for (let i = startDay; i > 0; i--) {
      const prevMonthDate = new Date(start);
      prevMonthDate.setDate(prevMonthDate.getDate() - i);
      days.push({ date: prevMonthDate, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDate = new Date(end);
      nextMonthDate.setDate(end.getDate() + i);
      days.push({ date: nextMonthDate, isCurrentMonth: false });
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1)
    );
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(
      (prevMonth) =>
        new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1)
    );
  }, []);

  const handleYearChange = useCallback((e) => {
    const year = parseInt(e.target.value);
    setCurrentMonth((prevMonth) => new Date(year, prevMonth.getMonth(), 1));
  }, []);

  const handleMonthChange = useCallback((e) => {
    const month = parseInt(e.target.value);
    setCurrentMonth((prevMonth) => new Date(prevMonth.getFullYear(), month, 1));
  }, []);

  const toggleCalendar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <input
        type="text"
        readOnly
        value={selectedDate ? formatDate(selectedDate) : ''}
        placeholder={placeholder}
        onClick={toggleCalendar}
        className={cn(
          'w-full p-2 border rounded-md cursor-pointer focus:outline-none',
          inputClassName
        )}
      />
      {isOpen && (
        <div
          className={cn(
            'absolute z-10 mt-1 bg-white border rounded-md shadow-lg w-full',
            className
          )}
          onClick={(e) => e.stopPropagation()}
          ref={dropdownRef}
        >
          <div className="flex items-center justify-center p-2 border-b">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center justify-between w-full gap-4">
              <select
                value={currentMonth.getMonth()}
                onChange={handleMonthChange}
                className="w-full px-2 py-1 bg-gray-200 rounded-3xl focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('default', {
                      month: 'long',
                    })}
                  </option>
                ))}
              </select>
              <select
                value={currentMonth.getFullYear()}
                onChange={handleYearChange}
                className="w-full px-2 py-1 bg-gray-200 rounded-3xl focus:outline-none"
              >
                {Array.from({ length: 71 }, (_, i) => {
                  const year = new Date().getFullYear() - 70 + i;
                  return (
                    <option key={i} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 p-2">
            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
              <div key={day} className="text-sm font-semibold text-center">
                {day}
              </div>
            ))}
            {generateCalendarDays().map(({ date, isCurrentMonth }, index) => (
              <button
                key={index}
                onClick={() => handleDateChange(date)}
                className={`p-2 text-center text-sm rounded-full hover:bg-gray-100 ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : ''
                }`}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Calendar.propTypes = {
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Calendar;

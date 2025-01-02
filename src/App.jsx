import Calendar from '@/components/Calendar';
import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({ dateOfBirth: '' });

  const handleDateChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const inputClassName =
    'flex border h-11 w-full rounded-3xl border-neutral-200 bg-gray-100 px-4 py-2 text-base focus:outline-none appearance-none';
  const labelClassName = 'text-base font-medium';

  return (
    <div className="min-h-screen  bg-gray-100">
      <div className="flex flex-col space-y-2 max-w-lg w-full mx-auto pt-20">
        <label htmlFor="dateOfBirth" className={labelClassName}>
          Date of Birth
        </label>
        <Calendar
          defaultValue={formData.birthDate}
          onChange={(date) =>
            handleDateChange('birthDate', date.toISOString().split('T')[0])
          }
          className="bg-white border-gray-200 rounded-3xl"
          inputClassName="rounded-3xl pl-4 bg-gray-100"
          placeholder="Select your birth date"
        />
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { FilterIcon, SearchIcon } from "lucide-react";
import Modal from "react-modal";

interface TestCase {
  id: number;
  test_case_name: string;
  estimated_time: string;
  module: string;
  priority: string;
  status: string;
}

function App() {
  const [testcaseData, setTestcaseData] = useState<TestCase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTestCase, setNewTestCase] = useState({
    test_case_name: "",
    estimated_time: "",
    module: "",
    priority: "",
    status: "",
  });

  useEffect(() => {
    const getResponse = async (): Promise<void> => {
      try {
        const res = await axios.get<TestCase[]>(
          "http://localhost:5000/testcase"
        );
        setTestcaseData(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getResponse();
  }, []);

  const handleStatusChange = async (
    testCase: TestCase,
    newStatus: string
  ): Promise<void> => {
    try {
      const updatedTestCase = { ...testCase, status: newStatus };
      await axios.put(
        `http://localhost:5000/testcase/${testCase.id}`,
        updatedTestCase
      );
      setTestcaseData((prevData) =>
        prevData.map((tc) => (tc.id === testCase.id ? updatedTestCase : tc))
      );
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTestCase((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post<TestCase>(
        `http://localhost:5000/testcase`,
        newTestCase
      );
      setTestcaseData([...testcaseData, res.data]);
      closeModal();
    } catch (error) {
      console.error("Error adding test case:", error);
    }
  };

  return (
    <div className="bg-blue-900 text-white flex justify-center items-center h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 relative flex items-center rounded-lg">
          <input
            type="text"
            placeholder="Search issue..."
            className="w-full p-2 rounded bg-blue-800 text-white focus:outline-0"
            value={""}
            onChange={() => {}}
          />
          <div className="absolute right-0 bg-red-600 p-2 rounded-md h-full cursor-pointer">
            <SearchIcon className="h-full w-5 text-white" />
          </div>
        </div>

        <div className="mb-4 relative flex items-center rounded-lg text-sm">
          <button className="w-20 bg-blue-800 text-white py-1 px-2 flex items-center justify-between rounded-md">
            Filter
            <FilterIcon className="h-4 w-4 text-white" />
          </button>
        </div>

        <button
          onClick={openModal}
          className="mb-4 bg-green-600 p-2 rounded-md text-white"
        >
          Add Test Case
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="overlay"
        >
          <h2 className="text-lg mb-4">Add New Test Case</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Test Case Name</label>
              <input
                type="text"
                name="test_case_name"
                value={newTestCase.test_case_name}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-blue-800 text-white focus:outline-0"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Estimated Time</label>
              <input
                type="text"
                name="estimated_time"
                value={newTestCase.estimated_time}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-blue-800 text-white focus:outline-0"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Module</label>
              <input
                type="text"
                name="module"
                value={newTestCase.module}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-blue-800 text-white focus:outline-0"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Priority</label>
              <input
                type="text"
                name="priority"
                value={newTestCase.priority}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-blue-800 text-white focus:outline-0"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Status</label>
              <select
                name="status"
                value={newTestCase.status}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-blue-800 text-white focus:outline-0"
              >
                <option value="">Select</option>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="bg-red-600 p-2 rounded-md text-white mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 p-2 rounded-md text-white"
              >
                Add
              </button>
            </div>
          </form>
        </Modal>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-800">
                <th className="p-2">Test Case Name</th>
                <th className="p-2">Estimate Time</th>
                <th className="p-2">Module</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {testcaseData.map((testCase) => (
                <tr
                  key={testCase.id}
                  className="bg-blue-700 border-b border-blue-600"
                >
                  <td className="p-2">{testCase.test_case_name}</td>
                  <td className="p-2">{testCase.estimated_time}</td>
                  <td className="p-2">{testCase.module}</td>
                  <td className="p-2">{testCase.priority}</td>
                  <td className="p-2">
                    <select
                      className="bg-blue-800 text-white p-2 rounded outline-0"
                      value={testCase.status}
                      onChange={(e) =>
                        handleStatusChange(testCase, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

import dayjs from "dayjs";

export const initialTaskCreationState = {
  isOverlayVisible: false,
  categoryClicked: "",
  hourFrom: null,
  hourTo: null,
  date: dayjs(),
  showWarningText: false,
  newTask: {
    name: "",
    category: "",
    date: dayjs().format('YYYY-MM-DD'),
    status: "Pending",
    hourfrom: "",
    hourto: "",
  },
  isLoading: false,
  allCategories: [{ name: "", numbers: "" }],
};

export function taskCreationReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_OVERLAY":
      return { ...state, isOverlayVisible: !state.isOverlayVisible };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "ADD_NEW_TASK":
      return { ...state, newTask: { ...state.newTask, ...action.payload } };
    case "SET_WARNING_TEXT":
      return { ...state, showWarningText: action.payload };
    case "RESET_NEW_TASK_FIELDS":
      return {
        ...initialTaskCreationState,
        isOverlayVisible: state.isOverlayVisible,
      };
    case "SET_ALL_CATEGORIES":
      return { ...state, allCategories: action.payload };
    case "SET_DATE":
      return {
        ...state,
        date: action.payload,
        newTask: {
          ...state.newTask,
          date: action.payload.format("YYYY-MM-DD"),
        },
      };
    case "SET_CATEGORY":
      return {
        ...state,
        categoryClicked: action.payload,
        newTask: { ...state.newTask, category: action.payload },
      };
    case "SET_TASK_NAME":
      return {
        ...state,
        newTask: { ...state.newTask, name: action.payload },
      };

      case "SET_HOUR_FROM":
        return {
          ...state,
          hourFrom: action.payload,
          newTask: { ...state.newTask, hourfrom: action.payload ? action.payload.format("hh:mm A") : "" },
        };
      
      case "SET_HOUR_TO":
        return {
          ...state,
          hourTo: action.payload,
          newTask: { ...state.newTask, hourto: action.payload ? action.payload.format("hh:mm A") : "" },
        };

    default:
      return state;
  }
}

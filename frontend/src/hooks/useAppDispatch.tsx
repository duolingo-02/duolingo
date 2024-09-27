import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store"; // Assurez-vous que le chemin est correct

export const useAppDispatch: () => AppDispatch = useDispatch;

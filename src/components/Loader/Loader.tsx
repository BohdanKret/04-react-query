import css from "./Loader.module.css";
import PulseLoader from "react-spinners/PulseLoader";

export default function Loader() {
  return (
    <div>
      <p className={css.text}>
        Loading movies, please wait...
        <PulseLoader color="#084298" />
      </p>
    </div>
  );
}

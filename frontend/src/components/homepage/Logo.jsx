
import Style from './home.module.css';
import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <div className={Style.p1}>
            <p className={Style.mot}>
              &quot;Track Your <span className={Style.diff} style={{ color: '#55E6A5' }}>Progress</span>, <br />
                Transform Your <span className={Style.diff} style={{ color: '#55E6A5' }}>Life</span>!&quot;
            </p>
            <Link to="/navigate">
                <button>Get Started</button>
            </Link>
        </div>
    );
}

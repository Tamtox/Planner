import './NotFound.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFrown} from '@fortawesome/free-regular-svg-icons';
import useRedirectOnSessionEnd from '../CustomHooks/useRedirectOnSessionEnd';

function NotFound() {
    useRedirectOnSessionEnd();
    return (
        <section id="notFound">
            <h2>Page Not Found</h2>
            <FontAwesomeIcon id="notFoundIcon" icon={faFrown} />
        </section>
    )
}

export default NotFound
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdCall } from "react-icons/md";
import constyle from './contact.module.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [popup, setPopup] = useState({ show: false, message: "", type: "" });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:9000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then(() => {
            setPopup({ show: true, message: "✅ Your query has been sent!", type: "success" });
            setFormData({ name: "", email: "", subject: "", message: "" });

            setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
        })
        .catch(() => {
            setPopup({ show: true, message: "❌ Failed to send. Try again!", type: "error" });
            setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
        });
    };

    return (
        <div className={constyle.contactbody}>
            <h1 className={constyle.hding}>Contact Us</h1>

            {popup.show && (
                <div className={`${constyle.popup} ${popup.type === "success" ? constyle.success : constyle.error}`}>
                    {popup.message}
                </div>
            )}

            <div className={constyle.contact}>
                {/* Left side - Contact Info */}
                <div className={constyle.headlogo}>
                    <div className={constyle.heading1}>
                        <span className={constyle.fit}>Fit </span>
                        <span className={constyle.track}>Track </span>
                        <span className={constyle.pro}>Pro</span>
                    </div>
                    <div className={constyle.div1}>
                        <MdCall color="#55E6A5" size={25} /> 
                        <p><span className={constyle.phno}>Phone:</span> 9398681164</p>
                    </div>
                    <div className={constyle.div2}>
                        <IoIosMail color="#55E6A5" size={25} /> 
                        <p>Support: fittrackpro@gmail.com</p>
                    </div>
                </div>

                {/* Right side - Form */}
                <form onSubmit={handleSubmit}>
                    <div className={constyle.forms}>
                        <label className={constyle.label}>Your Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className={constyle.input} 
                            required 
                        />

                        <label className={constyle.label}>Your Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className={constyle.input} 
                            required 
                        />

                        <label className={constyle.label}>Subject</label>
                        <input 
                            type="text" 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleChange} 
                            className={constyle.input} 
                            required 
                        />

                        <label className={constyle.label}>Message</label>
                        <textarea 
                            name="message" 
                            value={formData.message} 
                            onChange={handleChange} 
                            className={constyle.textarea} 
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className={constyle.send}>
                        Send &nbsp;<FaArrowRight size={15} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Contact;

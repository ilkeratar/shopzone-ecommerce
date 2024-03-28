import React, {useState} from 'react';

const Footer = () => {
    return (
        <footer className="py-1 pt-5">
            <p className="text-center mt-1 fw-bold">
                ShopZone - {new Date().getFullYear()}, All Rights Reserved
            </p>
        </footer>
    );
};

export default Footer;
import React, { useEffect, useState } from "react";

import ShowDevicePage from "./ShowDevicePage";
import { Typography, Box, Fade, CircularProgress } from "@mui/material";

const HomePage = () => {
    const UserId = "62WjDlu3uWTKnhjIRIYKCm9epX92";
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
            }}
        >
            <Fade in={!loading} timeout={800}>
                <Box>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: "bold",
                            color: "#00796b",
                            mb: 2,
                            textShadow: "1px 2px 8px #b2dfdb",
                        }}
                    >
                        Chào mừng đến với IOT Farm!
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#388e3c",
                            mb: 2,
                        }}
                    >
                        Giải pháp nông nghiệp thông minh giúp bạn quản lý và giám sát trang trại từ xa.
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#555",
                            maxWidth: 600,
                            textAlign: "center",
                        }}
                    >
                        Ứng dụng IOT Farm cung cấp các công cụ hiện đại để theo dõi thiết bị, cảm biến môi trường, và tự động hóa quy trình chăm sóc cây trồng. Hãy bắt đầu hành trình nông nghiệp thông minh cùng chúng tôi!
                    </Typography>
                </Box>
            </Fade>
            {loading && (
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <CircularProgress size={60} thickness={5} color="success" />
                </Box>
            )}
        </Box>
    );
};

export default HomePage;

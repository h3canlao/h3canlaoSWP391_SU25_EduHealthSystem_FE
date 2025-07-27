import React from 'react';
import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/react.svg";
import schoolHealthImg from "../assets/about-us.jpg";
import aboutUsImg1 from "../assets/about-us1.png";
import blogImg from "../assets/logo_1.png";
import blogImg1 from "../assets/logo_2.png";
import blogImg2 from "../assets/logo_3.png";

// Footer giống homepage
const Footer = () => (
    <Box sx={{ py: 4, textAlign: 'center', color: '#888', fontSize: 16, background: '#e0f7fa', mt: 8 }}>
        © 2025 EduHealth System. All rights reserved.
    </Box>
);

const blogPosts = [
    {
        id: 1,
        title: 'Tầm quan trọng của sức khỏe học đường',
        summary: 'Sức khỏe học đường đóng vai trò quan trọng trong sự phát triển toàn diện của học sinh. Việc giáo dục sức khỏe giúp nâng cao nhận thức và phòng tránh các bệnh thường gặp.',
        date: '2024-06-01',
        author: 'EduHealth Team',
        link: 'https://vnuhospital.vnu.edu.vn/y-te-hoc-duong-nen-tang-cho-suc-khoe-sinh-vien.html#:~:text=Y%20t%E1%BA%BF%20h%E1%BB%8Dc%20%C4%91%C6%B0%E1%BB%9Dng%20l%C3%A0%20m%E1%BB%99t%20trong%20nh%E1%BB%AFng,cao%20s%E1%BB%A9c%20kh%E1%BB%8Fe%20cho%20h%E1%BB%8Dc%20sinh%2C%20sinh%20vi%C3%AAn.',
    },
    {
        id: 2,
        title: 'Các phương pháp giáo dục sức khỏe hiệu quả',
        summary: 'Áp dụng các phương pháp giáo dục sức khỏe hiện đại giúp học sinh chủ động bảo vệ bản thân và xây dựng lối sống lành mạnh.',
        date: '2024-06-05',
        author: 'EduHealth Team',
        link: 'https://xaydungso.vn/blog/cach-thuc-hoat-dong-7-ky-nang-truyen-thong-giao-duc-suc-khoe-vi-cb.html',
    },
    {
        id: 3,
        title: 'Vai trò của dinh dưỡng trong học đường',
        summary: 'Dinh dưỡng hợp lý giúp học sinh phát triển thể chất và trí tuệ, đồng thời phòng ngừa các bệnh liên quan đến dinh dưỡng.',
        date: '2024-06-10',
        author: 'EduHealth Team',
        link: 'https://hocdinhduong.com/tam-quan-trong-va-vai-tro-cua-dinh-duong/',
    },
];

export default function Blog() {
    const navigate = useNavigate();
    return (
        <Box sx={{ background: '#f6faff', minHeight: '100vh' }}>

            <Box sx={{
                py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'lightcyan', position: 'sticky', top: 0, zIndex: 100
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logoImg} alt="EduHealth Logo" style={{ height: 48, marginRight: 16 }} />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#1890ff',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'none',

                        }}
                        onClick={() => navigate('/')}
                    >
                        EduHealth System
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            borderRadius: 25,
                            fontWeight: 700,
                            px: 4,
                            py: 1.2,
                            fontSize: 16,
                            boxShadow: '0 2px 8px rgba(0,188,212,0.10)',
                            background: 'linear-gradient(90deg,#1976d2 0%,#00bcd4 100%)',
                            color: '#fff',
                            textTransform: 'none',
                            ml: 3,
                            transition: '0.2s',
                            '&:hover': {
                                background: 'linear-gradient(90deg,#1565c0 0%,#0097a7 100%)',
                                color: '#fff',
                            },
                        }}
                        href="/blog"
                    >
                        About Us
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 20, fontWeight: 700, px: 3, boxShadow: '0 2px 8px rgba(0,188,212,0.08)' }}
                    href="/signin"
                >
                    Đăng nhập
                </Button>
            </Box>
            {/* Main content */}
            <Container maxWidth={false} disableGutters sx={{ pt: { xs: 0, md: 0 }, pb: 0 }}>
                {/* Banner Section */}
                <Box
                    sx={{
                        position: 'relative',
                        minHeight: 480,
                        borderRadius: 0,
                        overflow: 'hidden',
                        boxShadow: 'none',
                        background: 'linear-gradient(90deg,#e3f0ff 0%,#f6faff 100%)',
                        width: '100vw',
                        maxWidth: '100vw',
                    }}
                >
                    <img
                        src={schoolHealthImg}
                        alt="Y tế học đường"
                        style={{
                            width: '100vw',
                            height: 480,
                            objectFit: 'cover',
                            display: 'block',
                            opacity: 0.92,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: { xs: 40, md: 80 },
                            left: { xs: '50%', md: '50%' },
                            transform: 'translateX(-50%)',
                            maxWidth: { xs: 400, md: 600 },
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: '"Montserrat", "Arial", sans-serif',
                                fontWeight: 700,
                                color: '#1846c8',
                                mb: 2,
                                fontSize: { xs: '2.2rem', md: '3.2rem' },
                                letterSpacing: '-2px',
                                textAlign: 'center',
                            }}
                        >
                            Chào mừng đến với EduHealth System
                        </Typography>
                    </Box>
                </Box>

                {/* Giới thiệu Section */}
                <Box
                    sx={{
                        width: '100vw',
                        maxWidth: '100vw',
                        background: 'none',
                        py: { xs: 4, md: 8 },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: { md: 420 },
                    }}
                >
                    <Box
                        sx={{
                            background: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 4px 32px rgba(0,188,212,0.10)',
                            p: { xs: 2, md: 4 },
                            mr: { xs: 0, md: 6 },
                            mb: { xs: 3, md: 0 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: { md: 380 },
                            maxWidth: { xs: '90vw', md: 420 },
                        }}
                    >
                        <img
                            src={aboutUsImg1}
                            alt="Giới thiệu EduHealth"
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 12,
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'center', md: 'flex-start' },
                            justifyContent: 'center',
                            maxWidth: 600,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 16,
                                color: '#1976d2',
                                fontWeight: 600,
                                mb: 1,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                            }}
                        >
                            Về chúng tôi
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Montserrat", "Arial", sans-serif',
                                fontWeight: 700,
                                color: '#1976d2',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            Giới thiệu EduHealth
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: '"Montserrat", "Arial", sans-serif',
                                fontWeight: 400,
                                color: '#222',
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                textAlign: { xs: 'center', md: 'left' },
                                mb: 2,
                            }}
                        >
                            EduHealth là nền tảng giáo dục sức khỏe học đường, cung cấp kiến thức và giải pháp giúp học sinh, giáo viên và phụ huynh nâng cao nhận thức về sức khỏe. Chúng tôi chia sẻ các bài viết, nghiên cứu và kinh nghiệm thực tiễn nhằm xây dựng môi trường học đường an toàn, lành mạnh.
                        </Typography>

                    </Box>
                </Box>

                {/* Bài báo liên quan Section */}
                <Box
                    sx={{
                        px: { xs: 0, md: 0 },
                        py: { xs: 3, md: 4 },
                        background: 'linear-gradient(90deg,#e0f7fa 0%,#f6faff 100%)',
                        borderRadius: 0,
                        boxShadow: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100vw',
                        maxWidth: '100vw',
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Montserrat", "Arial", sans-serif',
                            fontWeight: 600,
                            color: '#1976d2',
                            mb: 3,
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                            textAlign: 'center',
                        }}
                    >
                        Bài báo liên quan
                    </Typography>
                    <Box sx={{ maxWidth: 800, width: '100%' }}>
                        {blogPosts.map((post, idx) => {
                            // Chọn ảnh theo thứ tự bài viết
                            let imgSrc = blogImg;
                            if (idx === 1) imgSrc = blogImg1;
                            if (idx === 2) imgSrc = blogImg2;
                            return (
                                <Card
                                    key={post.id}
                                    sx={{
                                        mb: 3,
                                        borderRadius: 4,
                                        boxShadow: '0 2px 12px rgba(0,188,212,0.07)',
                                        border: '1.5px solid #e0f7fa',
                                        background: '#fff',
                                        transition: 'box-shadow 0.2s',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box sx={{ flex: '0 0 auto', p: 2, pr: 0, display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={imgSrc}
                                            alt="Bài báo liên quan"
                                            style={{
                                                width: 90,
                                                height: 90,
                                                objectFit: 'cover',
                                                borderRadius: 12,
                                                boxShadow: '0 2px 8px rgba(0,188,212,0.10)',
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography
                                            variant="h6"
                                            component="a"
                                            href={post.link}
                                            sx={{
                                                fontFamily: '"Montserrat", "Arial", sans-serif',
                                                fontWeight: 700,
                                                color: '#2563eb',
                                                mb: 1,
                                                fontSize: { xs: '1.1rem', md: '1.3rem' },
                                                textDecoration: 'none',
                                                transition: 'color 0.2s',
                                                '&:hover': {
                                                    color: '#1976d2',
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {post.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: '"Montserrat", "Arial", sans-serif',
                                                color: '#334155',
                                                mb: 1,
                                                fontSize: { xs: '1rem', md: '1.1rem' },
                                            }}
                                        >
                                            {post.summary}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: '"Montserrat", "Arial", sans-serif',
                                                fontSize: 13,
                                                color: '#64748b',
                                            }}
                                        >
                                            {post.author} - {post.date}
                                        </Typography>
                                        <Button
                                            variant="text"
                                            href={post.link}
                                            sx={{
                                                mt: 1,
                                                color: '#1976d2',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                fontFamily: '"Montserrat", "Arial", sans-serif',
                                                '&:hover': { textDecoration: 'underline', color: '#00bcd4' },
                                            }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Đọc thêm
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
}
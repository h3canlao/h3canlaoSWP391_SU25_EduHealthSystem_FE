import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
// Use available images
import heroImg from "@/assets/bg2.jpg";
import chatDemoImg from "@/assets/yte.png";
import logoImg from "@/assets/react.svg";
import schoolHealthImg from "../assets/school-health.jpg";

// Placeholder Header and Footer
const Header = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'lightcyan', position: 'sticky', top: 0, zIndex: 100 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src={logoImg} alt="EduHealth Logo" style={{ height: 48, marginRight: 16 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1890ff' }}>EduHealth System</Typography>
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
          onClick={() => navigate("/blog")}
        >
          About Us
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ borderRadius: 20, fontWeight: 700, px: 3, boxShadow: '0 2px 8px rgba(0,188,212,0.08)' }}
        onClick={() => navigate("/signin")}
      >
        Đăng nhập
      </Button>
    </Box>
  );
};
const Footer = () => (
  <Box sx={{ py: 3, textAlign: 'center', background: 'PapayaWhip', mt: 6 }}>
    <Typography variant="body2">© {new Date().getFullYear()} EduHealth System. All rights reserved.</Typography>
  </Box>
);

const StyledButton = styled(Button)({
  borderRadius: "25px",
  textTransform: "none",
  padding: "10px 20px",
  fontWeight: 600,
});

const testimonials = [
  {
    name: "Nguyễn Thị Hạnh",
    school: "Trường Tiểu học Kim Liên",
    content:
      "Tôi rất hài lòng với hệ thống EduHealth. Tôi luôn nhận được thông báo kịp thời về sức khỏe và tiêm chủng của con mình.",
  },
  {
    name: "Trần Văn Minh",
    school: "Trường THCS Lê Quý Đôn",
    content:
      "Giao diện thân thiện, dễ sử dụng. Tôi có thể theo dõi lịch khám sức khỏe và lịch sử tiêm chủng của con rất tiện lợi.",
  },
  {
    name: "Lê Thị Mai",
    school: "Trường Tiểu học Nguyễn Du",
    content:
      "Hệ thống giúp tôi yên tâm hơn khi gửi con đến trường. Mọi thông tin đều minh bạch và rõ ràng.",
  },
];

const faqs = [
  {
    question: "Làm thế nào để đăng ký tài khoản phụ huynh?",
    answer:
      "Nhà trường sẽ cung cấp tài khoản cho bạn.",
  },
  {
    question: "Tôi có thể xem lịch sử tiêm chủng và khám sức khỏe của con ở đâu?",
    answer:
      "Sau khi đăng nhập, bạn vào mục 'Hồ sơ học sinh' để xem chi tiết lịch sử tiêm chủng và khám sức khỏe.",
  },
  {
    question: "Thông tin cá nhân của tôi và con tôi có được bảo mật không?",
    answer:
      "EduHealth cam kết bảo mật tuyệt đối thông tin cá nhân và chỉ sử dụng cho mục đích chăm sóc sức khỏe học đường.",
  },
  {
    question: "Tôi có thể nhận thông báo khi nào?",
    answer:
      "Bạn sẽ nhận được thông báo khi có lịch tiêm chủng, khám sức khỏe mới hoặc khi có kết quả mới về sức khỏe của con.",
  },
];


const Homepage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(0);

  return (
    <>
      <Header />
      <Box className="homepage" sx={{ background: '#f6faff' }}>
        {/* Hero Section */}
        <Box
          className="hero-section"
          sx={{
            minHeight: { xs: 400, md: 600 },
            width: '100%',
            position: 'relative',
            background: '#fff',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {/* Background image */}
          <img
            src={schoolHealthImg}
            alt="Y tế học đường"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'left center',
              zIndex: 1,
            }}
          />
          {/* Text content - align left, no box */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              px: { xs: 2, md: 10 },
              py: { xs: 6, md: 0 },
              maxWidth: 700,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              background: 'none',
              boxShadow: 'none',
              borderRadius: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Montserrat", "Arial", sans-serif',
                fontWeight: 700,
                color: '#1836a8',
                mb: 2,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.1,
                letterSpacing: '-2px',
              }}
            >
              EduHealth System
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Montserrat", "Arial", sans-serif',
                fontWeight: 400,
                color: '#222',
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                maxWidth: 520,
                mb: 3,
              }}
            >
              EduHealth System là nền tảng quản lý sức khỏe học đường thông minh, số hóa toàn bộ quy trình chăm sóc sức khỏe trong trường học. Kết nối phụ huynh, nhân viên y tế và nhà trường trên một hệ thống thống nhất, nâng cao hiệu quả quản lý, lưu trữ dữ liệu và đảm bảo an toàn sức khỏe học sinh.
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                fontSize: 18,
                borderRadius: 3,
                fontFamily: '"Montserrat", "Arial", sans-serif',
                fontWeight: 500,
              }}
              endIcon={<ArrowForwardIosIcon />}
              onClick={() => navigate("/signin")}
            >
              Đăng nhập
            </StyledButton>
          </Box>
        </Box>

        {/* Features Section */}
        <Box className="features-section" sx={{ py: { xs: 6, md: 10 }, display: 'flex', justifyContent: 'center' }}>
          <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid container spacing={6} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ color: '#00bcd4', fontWeight: 700 }}>10,000+</Typography>
                  <Typography>Phụ huynh sử dụng hệ thống</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ color: '#00bcd4', fontWeight: 700 }}>50,000+</Typography>
                  <Typography>Lượt thông báo sức khỏe gửi đi</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ color: '#00bcd4', fontWeight: 700 }}>99%</Typography>
                  <Typography>Phụ huynh hài lòng</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={chatDemoImg}
                    alt="Demo"
                    style={{
                      maxWidth: 450,
                      borderRadius: 16,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 700, textAlign: 'center' }}>
                    Tính năng nổi bật
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ color: "#00bcd4", fontSize: 24, marginRight: 8 }}>●</span>
                      <span><b>Thông báo tiêm chủng, khám sức khỏe</b><br />Nhận thông báo tự động về lịch tiêm chủng, khám sức khỏe của con.</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ color: "#00bcd4", fontSize: 24, marginRight: 8 }}>●</span>
                      <span><b>Tra cứu hồ sơ sức khỏe</b><br />Xem lịch sử tiêm chủng, khám sức khỏe, kết quả xét nghiệm mọi lúc mọi nơi.</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ color: "#00bcd4", fontSize: 24, marginRight: 8 }}>●</span>
                      <span><b>Phản hồi & đồng thuận trực tuyến</b><br />Phụ huynh có thể xác nhận hoặc phản hồi ý kiến về các hoạt động y tế của trường.</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ color: "#00bcd4", fontSize: 24, marginRight: 8 }}>●</span>
                      <span><b>Bảo mật & an toàn dữ liệu</b><br />Thông tin cá nhân và sức khỏe được bảo vệ tuyệt đối.</span>
                    </li>
                  </ul>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Success Stats Section */}
        <Box className="success-section" sx={{ py: { xs: 6, md: 10 }, background: 'linear-gradient(90deg, #fff 0%, #e0f7fa 100%)', display: 'flex', justifyContent: 'center' }}>
          <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ color: "#00bcd4", fontWeight: 700, mb: 1, textAlign: 'center' }}>
                  Vì sao chọn EduHealth?
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                  Đảm bảo sức khỏe học đường toàn diện
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
                  Hệ thống đã giúp hàng ngàn phụ huynh yên tâm hơn về sức khỏe của con em mình khi đến trường.
                </Typography>
                <Box sx={{ display: "flex", gap: 6, mb: 2, justifyContent: 'center' }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h3" sx={{ color: "#00bcd4", fontWeight: 700 }}>4x ↑</Typography>
                    <Typography sx={{ fontWeight: 500 }}>Tăng khả năng phát hiện sớm vấn đề sức khỏe</Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h3" sx={{ color: "#00bcd4", fontWeight: 700 }}>90% ↑</Typography>
                    <Typography sx={{ fontWeight: 500 }}>Phụ huynh hài lòng với dịch vụ</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box className="testimonials-section" sx={{ py: { xs: 6, md: 10 } }}>
          <Container>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", flex: 1 }}>
                Đánh giá của phụ huynh
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton sx={{ color: "#00bcd4", border: "1px solid #00bcd4" }}>
                  <ArrowBackIcon />
                </IconButton>
                <IconButton sx={{ color: "#00bcd4", border: "1px solid #00bcd4" }}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 4, overflow: "auto", pb: 2 }}>
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  sx={{ minWidth: 320, maxWidth: 360, flex: "0 0 auto", border: "1.5px solid #00bcd4", borderRadius: 4, boxShadow: "none", height: "100%" }}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Typography variant="h6" sx={{ color: "#00bcd4", fontWeight: 700, mb: 1 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      {testimonial.school}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {testimonial.content}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Đánh giá 5/5 sao
                        </Typography>
                        <Box sx={{ color: "#00bcd4" }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ fontSize: 18, marginRight: 2 }}>★</span>
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Học sinh xác thực
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span style={{ color: "#00bcd4", fontSize: 16 }}>●</span>
                          <Typography variant="body2">2024</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Box className="faq-section" sx={{ py: { xs: 6, md: 10 }, background: '#f6faff' }}>
          <Container>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
              Câu hỏi thường gặp
            </Typography>
            <Box>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  disableGutters
                  sx={{ mb: 2, borderRadius: index === 0 ? "20px" : "0", border: index === 0 ? "1.5px solid #00bcd4" : "none", boxShadow: "none", "&:before": { display: "none" } }}
                  expanded={expanded === index}
                  onChange={() => setExpanded(expanded === index ? false : index)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#00bcd4", transform: expanded === index ? "rotate(180deg)" : "none", transition: "0.2s" }} />}
                    aria-controls={`faq-content-${index}`}
                    id={`faq-header-${index}`}
                    sx={{ fontWeight: expanded === index ? 700 : 600, fontSize: 22, color: "#000", borderBottom: expanded === index ? "none" : "1.5px solid #00bcd4", minHeight: 64 }}
                  >
                    {faq.question}
                  </AccordionSummary>
                  <AccordionDetails sx={{ fontSize: 16, color: "#222", background: "#fff", borderRadius: "0 0 20px 20px" }}>
                    {faq.answer}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box className="cta-section" sx={{ py: 8, textAlign: 'center', background: 'linear-gradient(90deg, #e0f7fa 0%, #fff 100%)' }}>
          <Container>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Trải nghiệm hệ thống sức khỏe học đường thông minh ngay hôm nay!
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
              onClick={() => navigate("/signin")}
            >
              Đăng nhập
            </StyledButton>
          </Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Homepage;
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    render,
} from "@react-email/components";
import * as React from "react";

interface ReceiptEmailProps {
    orderId: string;
    email: string;
    tokens: Array<{
        token: string;
        product?: {
            name: string;
        } | null;
    }>;
    appUrl: string;
}

export const ReceiptEmail = ({
    orderId,
    tokens,
    appUrl,
}: ReceiptEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your digital downloads are ready!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={logo}>AI WEBSITE</Heading>
                    </Section>

                    <Section style={content}>
                        <Heading style={h1}>Thank you for your order!</Heading>
                        <Text style={text}>
                            Your order ID is <strong>{orderId}</strong>. You can access your digital downloads using the links below.
                        </Text>

                        <Hr style={hr} />

                        <Heading style={h2}>Your Downloads</Heading>
                        {tokens.map((t, index) => (
                            <Section key={index} style={itemSection}>
                                <Text style={productName}>{t.product?.name}</Text>
                                <Button
                                    style={button}
                                    href={`${appUrl}/download/${t.token}`}
                                >
                                    Download Now
                                </Button>
                            </Section>
                        ))}

                        <Hr style={hr} />

                        <Text style={footerText}>
                            These links will expire in 48 hours. Each file can be downloaded up to 5 times.
                        </Text>
                        <Text style={footerText}>
                            If you have any questions, simply reply to this email.
                        </Text>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerBrand}>© {new Date().getFullYear()} AI WEBSITE</Text>
                        <Link href={appUrl} style={footerLink}>Visit our Store</Link>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ReceiptEmail;

// Styles
const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "580px",
};

const header = {
    padding: "32px 0",
    textAlign: "center" as const,
};

const logo = {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    color: "#db143c", // Primary Maroon
    margin: "0",
};

const content = {
    padding: "0 24px",
};

const h1 = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
    color: "#111827",
};

const h2 = {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "24px 0 16px",
    color: "#111827",
};

const text = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#4b5563",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "32px 0",
};

const itemSection = {
    marginBottom: "24px",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
};

const productName = {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 12px",
    color: "#111827",
};

const button = {
    backgroundColor: "#db143c",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 24px",
    width: "100%",
    boxSizing: "border-box" as const,
};

const footer = {
    padding: "32px 24px",
    textAlign: "center" as const,
};

const footerText = {
    fontSize: "12px",
    lineHeight: "20px",
    color: "#9ca3af",
    marginBottom: "8px",
};

const footerBrand = {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#9ca3af",
    marginBottom: "8px",
};

const footerLink = {
    fontSize: "12px",
    color: "#db143c",
    textDecoration: "underline",
};

import { NextRequest, NextResponse } from "next/server";

import { subscribeToNewsletter } from "../../../../../actions/subscriptionActions";
import { sendMail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email presence
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get client info
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({
      email,
      source: "footer",
      ipAddress,
      userAgent,
    });

    // If subscription failed or already subscribed
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message,
          alreadySubscribed: result.alreadySubscribed || false,
        },
        { status: result.alreadySubscribed ? 200 : 400 }
      );
    }

    // Send welcome email
    const emailResult = await sendMail({
      email,
      subject: "Welcome to gofarm Newsletter! 🎉",
      text: `Thank you for subscribing to our newsletter! You're now part of our exclusive community.`,
      html: generateWelcomeEmailHTML(email),
    });

    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
      // Still return success for subscription even if email fails
    }

    return NextResponse.json(
      {
        message: result.message,
        subscriptionId: result.data?.subscriptionId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// Generate beautiful welcome email HTML
function generateWelcomeEmailHTML(email: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to gofarm Newsletter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-linear(135deg, #063c28 0%, #3b9c3c 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 18px;
            opacity: 0.95;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-message {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .welcome-message h2 {
            color: #063c28;
            font-size: 28px;
            margin-bottom: 15px;
        }
        
        .welcome-message p {
            color: #495057;
            font-size: 16px;
            line-height: 1.8;
        }
        
        .benefits {
            background: linear-linear(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid #dee2e6;
        }
        
        .benefits h3 {
            color: #063c28;
            font-size: 22px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .benefit-icon {
            font-size: 24px;
            margin-right: 15px;
            min-width: 30px;
        }
        
        .benefit-text h4 {
            color: #063c28;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .benefit-text p {
            color: #6c757d;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-linear(135deg, #063c28 0%, #3b9c3c 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(6, 60, 40, 0.3);
            transition: transform 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .social-proof {
            background: linear-linear(135d, #d1ecf1 0%, #b8e6ff 100%);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            border: 1px solid #bee5eb;
        }
        
        .social-proof h3 {
            color: #0c5460;
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        .social-proof p {
            color: #0c5460;
            font-size: 14px;
        }
        
        .footer {
            background: linear-linear(135deg, #343a40 0%, #495057 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
            border-top: 4px solid #063c28;
        }
        
        .footer p {
            margin-bottom: 15px;
            opacity: 0.9;
            font-size: 14px;
        }
        
        .footer a {
            color: #ffffff;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        
        .footer a:hover {
            opacity: 1;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            margin: 0 10px;
        }
        
        .unsubscribe {
            margin-top: 20px;
            font-size: 12px;
            opacity: 0.7;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
            }
            
            .header, .content, .footer {
                padding: 20px 15px;
            }
            
            .benefits {
                padding: 20px 15px;
            }
            
            .benefit-item {
                flex-direction: column;
                text-align: center;
            }
            
            .benefit-icon {
                margin: 0 0 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Welcome to gofarm!</h1>
            <p>Thank you for joining our newsletter community</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Welcome Message -->
            <div class="welcome-message">
                <h2>You're All Set! 🌟</h2>
                <p>
                    Thank you for subscribing to the gofarm newsletter! We're thrilled to have you as part of our community. 
                    Get ready to receive exclusive deals, new product announcements, and helpful shopping tips directly to your inbox.
                </p>
            </div>
            
            <!-- Benefits Section -->
            <div class="benefits">
                <h3>What You'll Get as a Subscriber</h3>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🎁</div>
                    <div class="benefit-text">
                        <h4>Exclusive Deals & Discounts</h4>
                        <p>Be the first to know about special promotions, flash sales, and subscriber-only discounts up to 50% off!</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🚀</div>
                    <div class="benefit-text">
                        <h4>Early Access to New Products</h4>
                        <p>Get a sneak peek and early access to our latest product launches before anyone else.</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">📦</div>
                    <div class="benefit-text">
                        <h4>Free Shipping Offers</h4>
                        <p>Enjoy exclusive free shipping promotions and special delivery deals reserved for our subscribers.</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">💡</div>
                    <div class="benefit-text">
                        <h4>Shopping Tips & Trends</h4>
                        <p>Stay updated with the latest shopping trends, product guides, and helpful tips to make the most of your purchases.</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🎂</div>
                    <div class="benefit-text">
                        <h4>Birthday Surprises</h4>
                        <p>Receive special birthday gifts and exclusive discounts to celebrate your special day with us!</p>
                    </div>
                </div>
            </div>
            
            <!-- CTA Section -->
            <div class="cta-section">
                <p style="margin-bottom: 20px; color: #495057;">Start exploring amazing deals today!</p>
                <a href="${
                  process.env.NEXT_PUBLIC_BASE_URL || "https://gofarm.com"
                }" class="cta-button">
                    Shop Now →
                </a>
            </div>
            
            <!-- Social Proof -->
            <div class="social-proof">
                <h3>Join 50,000+ Happy Subscribers!</h3>
                <p>You're now part of our growing community of savvy shoppers who never miss a great deal.</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>gofarm</strong></p>
            <p>123 Shopping Street, Commerce District<br>
               New York, NY 10001, USA</p>
            <p>
                Questions? Contact us at 
                <a href="mailto:support@gofarm.com">support@gofarm.com</a> or 
                call <a href="tel:+15551234567">+1 (555) 123-4567</a>
            </p>
            
            <div class="social-links">
                <a href="https://www.youtube.com/@reactjsBD">Facebook</a> |
                <a href="https://www.youtube.com/@reactjsBD">Twitter</a> |
                <a href="https://www.youtube.com/@reactjsBD">Instagram</a> |
                <a href="https://www.youtube.com/@reactjsBD">YouTube</a>
            </div>
            
            <div class="unsubscribe">
                <p>
                    You received this email because you subscribed to gofarm Newsletter with ${email}.<br>
                    <a href="${
                      process.env.NEXT_PUBLIC_BASE_URL ||
                      "https://gofarmpro.org"
                    }/unsubscribe?email=${encodeURIComponent(
    email
  )}">Unsubscribe</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

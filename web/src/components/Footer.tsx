import Link from "next/link";
import { contactConfig } from "@/config/contact";
import SocialMedia from "./common/SocialMedia";
import { client } from "@/sanity/lib/client";
import { quickLinksData } from "../../constants";
import Logo from "./Logo";
import FooterTop from "./layout/FooterTop";
import NewsletterForm from "./NewsletterForm";

const Footer = async () => {
  // Fetch categories from Sanity
  const categoriesQuery = `*[_type == "category"] | order(_createdAt desc) [0...7] {
    _id,
    title,
    slug
  }`;

  const categories = await client.fetch(categoriesQuery);

  return (
    <footer className="bg-gofarm-white border-t border-gofarm-light-gray mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section with contact info */}
        <FooterTop />

        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="mb-2">
              {/* <Logo variant="sm" /> */}
              <Logo className="w-32" />
            </div>
            <p className="text-gofarm-gray text-sm">
              {contactConfig.company.description}
            </p>
            <SocialMedia
              className="text-gofarm-black/60"
              iconClassName="border-gofarm-black/60 hover:border-gofarm-green hover:text-gofarm-green"
              tooltipClassName="bg-gofarm-black text-gofarm-white"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gofarm-black mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-gofarm-gray hover:text-gofarm-green text-sm font-medium hoverEffect"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gofarm-black mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories?.length > 0 ? (
                categories.map((item: any) => (
                  <li key={item?._id}>
                    <Link
                      href={`/category/${item?.slug?.current}`}
                      className="text-gofarm-gray hover:text-gofarm-green text-sm font-medium hoverEffect capitalize"
                    >
                      {item?.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gofarm-gray text-sm">
                  No categories available
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gofarm-black mb-4">Newsletter</h3>
            <p className="text-gofarm-gray text-sm mb-4">
              Subscribe to our newsletter to receive updates and exclusive
              offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="py-6 border-t border-gofarm-light-gray text-center text-sm text-gofarm-gray">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-gofarm-black font-black tracking-wider uppercase hover:text-gofarm-green hoverEffect group font-sans">
              Gofar
              <span className="text-gofarm-green group-hover:text-gofarm-black hoverEffect">
                m
              </span>
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

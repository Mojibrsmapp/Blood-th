import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'TotthoHub Blood - রক্ত দিন, জীবন বাঁচান | তথ্যহাব ব্লাড';
const DEFAULT_DESC = 'তথ্যহাব ব্লাড (TotthoHub Blood) - বাংলাদেশের বিশ্বস্ত রক্তদান ও রক্তদাতা ম্যাচিং প্ল্যাটফর্ম। জরুরি রক্তের প্রয়োজনে খুঁজুন নিকটস্থ রক্তদাতা।';
const getActiveBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.origin) {
    const origin = window.location.origin;
    if (origin.includes('roktodao.pro.bd') || origin.includes('totthohub.com')) {
      return origin;
    }
  }
  return 'https://blood.totthohub.com';
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
}) => {
  const location = useLocation();
  const currentBaseUrl = getActiveBaseUrl();
  const finalOgImage = ogImage || `${currentBaseUrl}/og-image.png`;

  useEffect(() => {
    // 1. Update Document Title
    const finalTitle = title ? `${title} | TotthoHub Blood` : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to update or create meta tag
    const setMetaTag = (attribute: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description & Keywords
    const finalDesc = description || DEFAULT_DESC;
    setMetaTag('name', 'description', finalDesc);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 3. Canonical URL
    const finalCanonical = canonical || `${currentBaseUrl}${location.pathname}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', finalCanonical);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', finalOgImage);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDesc);
    setMetaTag('name', 'twitter:image', finalOgImage);

    // 6. Dynamic JSON-LD Structured Data
    const scriptId = 'dynamic-seo-ldjson';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, canonical, ogImage, ogType, jsonLd, location.pathname]);

  return null;
};

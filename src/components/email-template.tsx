import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>
      Hi {firstName}✋! This is the Scraped data from your last upload! Enjoy your data🎉!
    </h1>
  </div>
);

export default EmailTemplate;

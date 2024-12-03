import React from "react";
import { Helmet } from "react-helmet";

type PageProps = {
  title: string;
} & (
  | {
      page: React.ComponentType;
      children?: never;
    }
  | {
      page?: never;
      children: React.ReactNode;
    }
);

export default function Page({ title, page, children }: PageProps) {
  return (
    <>
      <Helmet key={title}>
        <title>{title}</title>
      </Helmet>
      {page ? React.createElement(page) : children}
    </>
  );
}

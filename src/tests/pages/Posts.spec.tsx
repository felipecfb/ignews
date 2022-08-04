import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getServerSideProps, Post } from "../../pages/posts";
import { createClient } from "../../services/prismic";

jest.mock("../../services/prismic");

const posts = [
  {
    slug: "my-new-post",
    title: "My new post",
    excerpt: "Post excerpt...",
    updatedAt: "2020-01-01",
  },
] as Post[];

jest.mock("../../services/prismic");

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(createClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
        {
          uid: "my-new-post",
          data: {
            title: "My new post",
            content: [
              {
                type: "paragraph",
                text: "Post excerpt",
              },
            ],
          },
          last_publication_date: "04-01-2021",
        },
      ]),
    } as any);

    const response = await getServerSideProps();

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-new-post",
              title: "My new post",
              excerpt: "Post excerpt...",
              updatedAt: "01 de abril de 2021",
            },
          ],
        },
      })
    );
  });
});

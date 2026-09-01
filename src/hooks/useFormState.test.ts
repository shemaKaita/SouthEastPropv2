import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormState } from "@/hooks/useFormState";

describe("useFormState", () => {
  it("initializes with provided values", () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: "", email: "" },
        onSubmit: vi.fn(),
      }),
    );
    expect(result.current.values).toEqual({ name: "", email: "" });
    expect(result.current.status).toBe("idle");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("setField updates value and clears error", () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: "", email: "" },
        onSubmit: vi.fn(),
      }),
    );
    act(() => {
      result.current.setField("name", "John");
    });
    expect(result.current.values.name).toBe("John");
  });

  it("setValues merges partial updates", () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: "", email: "" },
        onSubmit: vi.fn(),
      }),
    );
    act(() => {
      result.current.setValues({ name: "Jane" });
    });
    expect(result.current.values.name).toBe("Jane");
    expect(result.current.values.email).toBe("");
  });

  it("handleSubmit calls onSubmit with values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: "Test", email: "test@test.com" },
        onSubmit,
      }),
    );
    const preventDefault = vi.fn();
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault,
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Test",
      email: "test@test.com",
    });
    expect(result.current.status).toBe("success");
    expect(result.current.isSuccess).toBe(true);
  });

  it("validation errors prevent submission", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: "", email: "" },
        onSubmit,
        validate: (values) => {
          const errors: Record<string, string> = {};
          if (!values.name) errors.name = "Required";
          return errors;
        },
      }),
    );
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBe("Required");
    expect(result.current.status).toBe("idle");
  });

  it("catches onSubmit errors", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: "Test", email: "" },
        onSubmit,
      }),
    );
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.status).toBe("error");
    expect(result.current.hasError).toBe(true);
    expect(result.current.serverError).toBe("Network error");
  });

  it("reset returns to initial state", () => {
    const { result } = renderHook(() =>
      useFormState({
        initialValues: { name: "Initial", email: "" },
        onSubmit: vi.fn(),
      }),
    );
    act(() => {
      result.current.setField("name", "Changed");
    });
    expect(result.current.values.name).toBe("Changed");
    act(() => {
      result.current.reset();
    });
    expect(result.current.values.name).toBe("Initial");
    expect(result.current.status).toBe("idle");
  });
});

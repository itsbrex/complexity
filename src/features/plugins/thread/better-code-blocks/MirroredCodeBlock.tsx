import { StandardCodeBlock } from "@/features/plugins/thread/better-code-blocks/variants/standard/Standard";

const VARIANTS = {
  standard: StandardCodeBlock,
} as const;

export default function MirroredCodeBlock({
  variant,
}: {
  variant: keyof typeof VARIANTS;
}) {
  const Variant = VARIANTS[variant];
  return <Variant />;
}

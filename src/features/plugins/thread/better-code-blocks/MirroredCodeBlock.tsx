import { BaseCodeBlockWrapper } from "@/features/plugins/thread/better-code-blocks/variants/base/Wrapper";

const VARIANTS = {
  base: BaseCodeBlockWrapper,
} as const;

const MirroredCodeBlock = memo(function MirroredCodeBlock({
  variant,
}: {
  variant: keyof typeof VARIANTS;
}) {
  const Variant = VARIANTS[variant];
  return <Variant />;
});

export default MirroredCodeBlock;

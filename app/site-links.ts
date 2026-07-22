export const instagramUrl = "https://www.instagram.com/kachalaba_swim/";
export const telegramUrl = "https://t.me/m/mIj5epmcZGE6";
export const whatsappUrl = "https://wa.me/380970353470";
export const happyTriFriendsUrl = "https://happytrifriends.com";
export const analysisPath = "/analysis";

export function analysisTelegramUrl() {
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim();
  return username ? `https://t.me/${username}?start=analysis` : telegramUrl;
}

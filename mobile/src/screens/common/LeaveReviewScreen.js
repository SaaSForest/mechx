import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star, SealCheck } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Avatar, Button } from '../../components/ui';
import useReviewStore from '../../store/reviewStore';

const LeaveReviewScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { offer, seller, partName } = route.params || {};
  const { createReview, isLoading } = useReviewStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }

    const result = await createReview({
      offer_id: offer.id,
      rating,
      comment: comment.trim() || null,
    });

    if (result.success) {
      Alert.alert('Thank You!', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to submit review');
    }
  };

  const renderStar = (index) => {
    const filled = index <= rating;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index)}
        style={styles.starButton}
      >
        <Star
          size={40}
          weight={filled ? 'fill' : 'regular'}
          color={filled ? '#F59E0B' : colors.gray[300]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.gray[600]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave a Review</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seller Info Card */}
        <Card padding={20} style={styles.sellerCard}>
          <View style={styles.sellerInfo}>
            <Avatar
              source={seller?.profile_photo}
              name={seller?.full_name || seller?.name}
              size={64}
            />
            <View style={styles.sellerDetails}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>
                  {seller?.full_name || seller?.name}
                </Text>
                {seller?.is_verified && (
                  <SealCheck size={18} weight="fill" color={colors.success} />
                )}
              </View>
              <Text style={styles.partText}>
                {partName}
              </Text>
              <Text style={styles.priceText}>
                Purchased for L{offer?.price}
              </Text>
            </View>
          </View>
        </Card>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <Text style={styles.sectionSubtitle}>
            Tap a star to rate your transaction
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(renderStar)}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </View>

        {/* Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Add a comment (optional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Share your experience with this seller..."
            placeholderTextColor={colors.gray[400]}
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {comment.length}/500
          </Text>
        </View>

        {/* Submit Button */}
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={rating === 0}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.gray[900],
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  sellerCard: {
    marginBottom: 24,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerDetails: {
    marginLeft: 16,
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sellerName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: colors.gray[900],
  },
  partText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 2,
  },
  priceText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.brand[500],
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[900],
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.brand[500],
    marginTop: 12,
  },
  commentSection: {
    marginBottom: 32,
  },
  commentInput: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.gray[900],
    minHeight: 120,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  charCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default LeaveReviewScreen;

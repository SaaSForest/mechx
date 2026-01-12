import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {  CaretLeft, Star, SealCheck } from 'phosphor-react-native';
import { colors, typography } from '../../config/theme';
import { Card, Avatar } from '../../components/ui';
import { EmptyState } from '../../components/shared';
import useReviewStore from '../../store/reviewStore';
import { formatRelativeTime } from '../../utils/date';

const SellerReviewsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { seller } = route.params || {};
  const { reviews, fetchUserReviews, isLoading } = useReviewStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (seller?.id) {
      fetchUserReviews(seller.id);
    }
  }, [seller?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserReviews(seller.id);
    setRefreshing(false);
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            size={16}
            weight={index <= rating ? 'fill' : 'regular'}
            color={index <= rating ? '#F59E0B' : colors.gray[300]}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }) => (
    <Card padding={16} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Avatar
            source={item.reviewer?.profile_photo}
            name={item.reviewer?.full_name}
            size={40}
          />
          <View style={styles.reviewerDetails}>
            <Text style={styles.reviewerName}>{item.reviewer?.full_name}</Text>
            {renderStars(item.rating)}
          </View>
        </View>
        <Text style={styles.reviewDate}>
          {formatRelativeTime(item.created_at)}
        </Text>
      </View>
      {item.comment && (
        <Text style={styles.reviewComment}>{item.comment}</Text>
      )}
      {item.part_name && (
        <Text style={styles.partName}>For: {item.part_name}</Text>
      )}
    </Card>
  );

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          {/* <ArrowLeft size={24} color={colors.gray[600]} /> */}
           <CaretLeft size={24} weight="bold" color={colors.gray[900]} />

        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Seller Summary */}
      <View style={styles.sellerSummary}>
        <Avatar
          source={seller?.profile_photo}
          name={seller?.full_name || seller?.name}
          size={64}
        />
        <View style={styles.sellerInfo}>
          <View style={styles.sellerNameRow}>
            <Text style={styles.sellerName}>
              {seller?.full_name || seller?.name}
            </Text>
            {seller?.is_verified && (
              <SealCheck size={18} weight="fill" color={colors.success} />
            )}
          </View>
          <View style={styles.ratingRow}>
            <Star size={20} weight="fill" color="#F59E0B" />
            <Text style={styles.avgRating}>{avgRating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </Text>
          </View>
        </View>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.brand[500]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Star size={40} color={colors.gray[400]} />}
            title="No reviews yet"
            description="This seller hasn't received any reviews yet."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.gray[50],
    backgroundColor: colors.white,
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
  sellerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  sellerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sellerName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: colors.gray[900],
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avgRating: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.gray[900],
  },
  reviewCount: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[500],
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewerDetails: {
    marginLeft: 12,
  },
  reviewerName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.gray[900],
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.gray[400],
  },
  reviewComment: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  partName: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default SellerReviewsScreen;

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "cluster_oidc_provider_url" {
  description = "OIDC provider URL for EKS cluster"
  value       = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

output "cluster_oidc_provider_arn" {
  description = "OIDC provider ARN for EKS cluster"
  value       = aws_iam_openid_connect_provider.cluster.arn
}

output "node_groups" {
  description = "Node group information"
  value = {
    for k, v in aws_eks_node_group.main : k => {
      id   = v.id
      arn  = v.arn
      status = v.status
    }
  }
}

